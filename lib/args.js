const { log } = require('./utils');

function parseArgs(argv = null) {
  if (argv === null) { argv = process.argv.slice(2); }

  const args = {};
  const cmd = argv[0];
  if (shouldShowHelp(cmd)) {
    args['help'] = true;
  }

  if (cmd === 'start') {
    const flags = getFlags(argv);
    args['start'] = flags;
  }

  if (cmd === 'start-services') {
    args['startServices'] = true;
  }

  return parsePassedArgs(args);
}

function parsePassedArgs(argv) {
  const allowedCmds = ['help', 'start', 'start-services'];
  for (let key in argv) {
    if (allowedCmds[key] === -1) {
      log.error(`Invalid cmd: ${key} is not a valid command see below: `);
      return { help: true };
    }
  }
  return argv;
}

function shouldShowHelp(cmd) {
  let state = false;
  switch (cmd) {
    case undefined:
    case '--help':
    case 'help':
    case '-h':
    case '':
      state = true;
      break;
  }
  return state;
}

function getFlags(args) {
  const strArgs = args.join(' ');
  const flags = {};
  args = strArgs.split(' -- ');
  args[0] = args[0].split(' ');

  args[0].forEach((flag, index) => {
    if (!flag.includes('-')) {
      return;
    }

    const valueIntialized = flag.includes('=');
    flag = flag.replace(/^-*/g, '');
    if (!valueIntialized) {
      const value = args[0][index + 1];
      flag[flag.charAt(0)] = value;
      flags[flag] = value;
      return;
    }

    flag = flag.split('=');
    flags[flag[0]] = flag[1];
    flags[flag[0].charAt(0)] = flag[1];
  });

  if (args[1]) {
    flags['passArgs'] = args[1].split(' ');
  } else {
    flags['passedArgs'] = [];
  }

  return flags;
}

module.exports = parseArgs;
