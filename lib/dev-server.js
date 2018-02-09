const { execFile } = require('child_process');
const events = require('events');
const startServices = require('./start-services');
const utils = require('./utils');

class DevServerManager extends events {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  startServer(args = {}) {
    const zulipDir = utils.parseZulipPath(args['zulip-path']);
    const { passedArgs = [] } = args;

    startServices()
      .then(() => {
        this.emit('services-started');
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
          this.emit('stdout', _);
          this.emit('output', _);
          if (shouldLog) {
            process.stdout.write(_);
          }
        });

        devProcess.stderr.on('data', _ => {
          this.emit('stderr', _);
          this.emit('output', _);
          if (shouldLog) {
            process.stderr.write(_);
          }
        });

        devProcess.on('exit', (code) => {
          shouldLog = false;
          devProcKilled = true;
          this.emit('exit', code);
          process.exit(code);
        });

        function handleExit() {
          // handle race condition between devProcess.exit and
          // process.on('exit') events
          if (!devProcKilled) {
            this.emit('exit', 0); // normal exit
            devProcess.kill();
          }
        }

        process.on('SIGINT', handleExit);
        process.on('SIGTERM', handleExit);
      });
  }
}

module.exports = new DevServerManager();
