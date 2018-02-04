const { spawnSync } = require('child_process');
const SERVICES = [
  'memcached',
  'rabbitmq-server',
  'redis-server',
  'postgresql'
];

function runSync(cmd, args, opts = {}) {
  let proc = spawnSync(cmd, args, Object.assign({
    cwd: process.cwd()
  }, opts));
  return proc;
}

function isServiceStarted(service) {
  let status = runSync('sudo', ['service', service, 'status']);
  status = status.stdout.toString();
  let started = true;

  console.log(status);
  switch (service) {
    case 'memcached':
      started = !status.includes('not running');
      break;

    case 'rabbitmq-server':
      started = !/diagnostics/gi.test(status);
      break;

    case 'redis-server':
      started = !status.includes('not running');
      break;

    case 'postgresql':
      // travis postgresql has 4 broker's running
      // we only check for one running in travis ci.
      started = status.includes('online');
      break;

    default:
      // no services matched so it's a typo
      // somewhere faile to let user know
      const msg = `Invalid service passed to checkServicesStarted: ${service}`;
      throw new Error(msg);
  }

  return started;
}

function checkServicesStarted(service) {
  const services = service ? [service] : SERVICES;
  const status = services.every(isServiceStarted);
  if (!status) {
    return new Error('All services are not started.');
  }
}

module.exports = {
  runSync,
  SERVICES,
  checkServicesStarted
};
