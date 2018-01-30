const utils = require('./utils');
const { log } = utils;

function provision(args) {
  const zulipPath = args.z || utils.defaultZulipPath;
  const zulipDir = utils.parseZulipPath(zulipPath);
  const { passedArgs } = args;
  const additionalArgs = passedArgs.length !== 0 ? passedArgs.join(' ') : '';

  // sanity check bail out if there is no zulip directory
  if (zulipDir === false) {
    log.error('Zulip Path:', zulipPath, 'does not exsist.');
    process.exit(1);
  }

  // this is expected to fail once due to rabbit-mq server
  // if this is the first time user is running provision
  utils.run(`./tools/provision ${additionalArgs}`, zulipDir)
    .then(({ statusCode }) => {
      if (statusCode !== 0) {
        provison_startRabbitmq(additionalArgs, zulipDir);
      }
    });
}

function provison_startRabbitmq(additionalArgs, zulipDir) {
  log.info('starting required services...');
  utils.run('./start-services.sh', __dirname)
    .then(() => {
      log.info('running provision...');
      utils.run(`./tools/provision ${additionalArgs}`, zulipDir)
        .then(_ => {
          if (_.statusCode !== 0) {
            log.error('Provision failed even after restarting services.');
          }
        });
    });
}

module.exports = provision;
