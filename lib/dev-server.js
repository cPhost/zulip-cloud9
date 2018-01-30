const { execFile } = require('child_process');
const startServices = require('./start-services');
const utils = require('./utils');
const { log } = utils;

function startServer(args = {}) {
  const zulipPath = args.z || utils.defaultZulipPath;
  const zulipDir = utils.parseZulipPath(zulipPath);
  const { passedArgs } = args;

  // sanity check bail out if there is no zulip directory
  if (zulipDir === false) {
    log.error('Zulip Path:', zulipPath, 'does not exsist.');
    process.exit(1);
  }

  startServices({ sync: true });

  const runDevArgs = ['--zulip-dir', zulipDir];
  runDevArgs.concat(passedArgs);
  const opts = {
    cwd: __dirname,
    env: Object.assign(process.env, {
      'EXTERNAL_HOST': process.env.C9_HOSTNAME
    })
  };

  let shouldLog = true;
  let devProcKilled = false;
  const devProcess = execFile('./run-dev.py', runDevArgs, opts);

  devProcess.stdout.on('data', _ => {
    if (shouldLog) {
      process.stdout.write(_);
    }
  });

  devProcess.stderr.on('data', _ => {
    if (shouldLog) {
      process.stderr.write(_);
    }
  });

  devProcess.on('exit', (code) => {
    shouldLog = false;
    devProcKilled = true;
    process.exit(code);
  });

  function handleExit() {
    if (!devProcKilled) {
      devProcess.kill();
    }
  }

  process.on('SIGINT', handleExit);
  process.on('SIGTERM', handleExit);
}

module.exports = startServer;
