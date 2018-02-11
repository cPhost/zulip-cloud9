const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class Logger {
  constructor() {
    this.blue = '\u001b[34m';
    this.red = '\u001b[31m';
    this.yellow = '\u001b[33m';
    this.end = '\u001b[39m';
  }

  info(...args) {
    args.unshift(this.blue);
    args.push(this.end);
    console.log.apply(null, args);
  }

  warn(...args) {
    args.unshift(this.yellow);
    args.push(this.end);
    console.warn.apply(null, args);
  }

  error(...args) {
    args.unshift(this.red);
    args.push(this.end);
    console.error.apply(null, args);
  }
}

const logger = new Logger();

const defaultZulipPath = '/home/ubuntu/workspace/zulip';
function parseZulipPath(zulipPath) {
  if (zulipPath) {
    // check if path exsists
    if (pathExists(zulipPath)) {
      return path.resolve(zulipPath);
    }
    logger.error(`zulip path passed: ${zulipPath} does not exsist!`);
    process.exit(1);
  }

  if (path.basename(process.cwd()) === 'zulip') {
    return process.cwd();
  }

  if (!pathExists(defaultZulipPath)) {
    logger.warn(['Error: current directory is not a zulip directory,',
      'and /home/ubuntu/workspace/zulip does not exsist,',
      'if have a diffrent location you can use --zulip-path.'].join('\n '));
    process.exit(1);
  }

  return defaultZulipPath;
}

function pathExists(passedPath) {
  passedPath = path.resolve(passedPath);
  return fs.existsSync(passedPath);
}

const defaultOpts = {
  env: Object.assign(process.env, {
    EXTERNAL_HOST: process.env.C9_HOSTNAME
  })
};

function run(cmd, zulipDir, opts = {}) {
  cmd = cmd.split(' ');
  defaultOpts.cwd = zulipDir || defaultZulipPath;
  const args = cmd.slice(1);

  return new Promise((resolve) => {
    const { ignoreLogging = false } = opts;

    let output = '';
    const proc = spawn(cmd[0], args, Object.assign(defaultOpts, opts));

    if (proc.stdout) {
      proc.stdout.on('data', (data) => {
        output += data.toString();
        if (!ignoreLogging) { process.stdout.write(data); }
      });
    }

    if (proc.stderr) {
      proc.stdout.on('data', (data) => {
        output += data.toString();
        if (!ignoreLogging) { process.stdout.write(data); }
      });
    }

    proc.on('exit', (code) => {
      const result = {
        statusCode: code,
        output
      };

      resolve(result);
    });
  });
}

module.exports = {
  logger,
  parseZulipPath,
  run
};
