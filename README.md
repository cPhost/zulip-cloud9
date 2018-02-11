# zulip-cloud9
[![npm](https://img.shields.io/npm/v/zulip-cloud9.svg?style=flat-square)](https://npmjs.org/package/zulip-cloud9)
[![Build Status](https://img.shields.io/travis/cPhost/zulip-cloud9.svg?style=flat-square)](https://travis-ci.org/cPhost/zulip-cloud9)
[![codecov](https://img.shields.io/codecov/c/github/cPhost/zulip-cloud9.svg?style=flat-square)](https://codecov.io/gh/cPhost/zulip-cloud9)

zulip-cloud9 provides a wrapper for running zulip dev environment on cloud9.

## Usage

### Install
Installing zulip-cloud9 package and zulip dev enviorment in a cloud9 workspace is documented in [wiki](../../wiki)

```
zulip-dev <command>

Commands:
  zulip-dev start           Start zulip-dev server on http://0.0.0.0
  zulip-dev start-services  Start all the required services for zulip.

Options:
  --version   Show version number                                      [boolean]
  --help, -h  Show help                                                [boolean]

```

### `zulip-dev start`
This starts the dev enviorment. This command exports `EXTERNAL_HOST` and handles if starts the services beforehand if needed to. This by default binds the host to `0.0.0.0` rather than `127.0.0.1` so it works on cloud9 and sets the port to `8080`.

### `zulip-dev start-services`
If you have not run `zulip-dev start` and you need to run provison use this command and then run provision.
This script starts all the services only if needed. You can run this script if you encounter an error's documented in [wiki](../../wiki/Errors)

Errors you can encounter in cloud9 workspace while working with zulip dev enviorment are documented in [wiki](../../wiki/Errors)
