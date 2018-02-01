const utils = require('./utils');
const { log } = utils;

const opts = {
  ignoreLogging: true
};

let count = 0;
function serviceManager() {
  count++;
  if (count === 4) {
    log.info('All services required for zulip dev env started.');
  }
}

function startServices(args = {}) {
  let run = utils.run;
  if (args.sync) {
    run = utils.runSync;
  }

  run('sudo service memcached status', __dirname, opts)
    .then(res => {
      const { output } = res;

      // if running output would be "* memecached is running".
      if (output.includes('not running')) {
        log.info('starting service memcached.');
        run('sudo service memcached start', __dirname)
          .then(serviceManager);
      } else {
        log.info('memcached service is already running.');
        serviceManager();
      }
    });

  run('sudo service rabbitmq-server status', __dirname, opts)
    .then(res => {
      const { output } = res;

      // rabbitmq is running we do not have to
      // start it ourself but we do need to restart if
      // it has some errors if so it would have key word `diagnostics`
      if (/diagnostics/gi.test(output)) {
        log.info('starting service rabbitmq-server.');
        run('sudo service rabbitmq-server restart', __dirname)
          .then(serviceManager);
      } else {
        log.info('rabbitmq-server service is already running.');
        serviceManager();
      }
    });

  run('sudo service redis-server status', __dirname, opts)
    .then(res => {
      const { output } = res;

      // if redis-server is not running the
      // output will be "redis-server is not running"
      if (output.includes('not running')) {
        log.info('starting service redis-server.');
        run('sudo service redis-server start', __dirname)
          .then(serviceManager);
      } else {
        log.info('service redis-server is already running.');
        serviceManager();
      }
    });

  run('sudo service postgresql status', __dirname, opts)
    .then(res => {
      const { output } = res;

      // if postgresql is not working it would have
      // "9.3/main (port 5432): down"
      if (output.includes('down')) {
        log.info('starting service postgresql.');
        run('sudo service postgresql start', __dirname)
          .then(serviceManager);
      } else {
        log.info('service postgresql is already running.');
        serviceManager();
      }
    });
}

module.exports = startServices;
