const { execFile } = require('child_process');
const startServices = require('./start-services');
const utils = require('./utils');

function startServer(args = {}) {
  const zulipDir = utils.parseZulipPath(args['zulip-path']);
  const { passedArgs = [] } = args;

  startServices({ sync: true });

  let runDevArgs = ['--zulip-dir', zulipDir];
  runDevArgs = runDevArgs.concat(passedArgs);
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
