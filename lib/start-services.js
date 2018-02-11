const utils = require('./utils');
const { logger, run } = utils;

const opts = {
  ignoreLogging: true
};

let count = 0;
function serviceManager() {
  count++;
  if (count === 4) {
    logger.info('All services required for zulip dev env started.');
  }
}

function startServices() {
  const memcached = new Promise((resolve) => {
    run('sudo service memcached status', __dirname, opts)
      .then(res => {
        const { output } = res;

        // if running output would be "* memecached is running".
        if (output.includes('not running')) {
          logger.info('starting service memcached.');
          run('sudo service memcached restart', __dirname, opts)
            .then(() => {
              serviceManager();
              resolve();
            });
        } else {
          logger.info('memcached service is already running.');
          serviceManager();
          resolve();
        }
      });
  });

  const rabbitmq = new Promise((resolve) => {
    run('sudo service rabbitmq-server status', __dirname, opts)
      .then(res => {
        const { output } = res;

        // rabbitmq is running we do not have to
        // start it ourself but we do need to restart if
        // it has some errors if so it would have key word `diagnostics`
        if (/diagnostics/gi.test(output)) {
          logger.info('starting service rabbitmq-server.');
          run('sudo service rabbitmq-server restart', __dirname, opts)
            .then(() => {
              startServices();
              resolve();
            });
        } else {
          logger.info('rabbitmq-server service is already running.');
          serviceManager();
          resolve();
        }
      });
  });

  const redis = new Promise((resolve) => {
    run('sudo service redis-server status', __dirname, opts)
      .then(res => {
        const { output } = res;

        // if redis-server is not running the
        // output will be "redis-server is not running"
        if (output.includes('not running')) {
          logger.info('starting service redis-server.');
          run('sudo service redis-server restart', __dirname, opts)
            .then(() => {
              startServices();
              resolve();
            });
        } else {
          logger.info('service redis-server is already running.');
          serviceManager();
          resolve();
        }
      });
  });

  const postgres = new Promise((resolve) => {
    run('sudo service postgresql status', __dirname, opts)
      .then(res => {
        const { output } = res;

        // if postgresql is working propertly it would have
        // "9.3/main (port 5432): down"
        if (!output.includes('online')) {
          logger.info('starting service postgresql.');
          run('sudo service postgresql restart', __dirname)
            .then(() => {
              serviceManager();
              resolve();
            });
        } else {
          logger.info('service postgresql is already running.');
          serviceManager();
          resolve();
        }
      });
  });

  return Promise.all([memcached, rabbitmq, redis, postgres]);
}

module.exports = startServices;
