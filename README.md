# zulip-cloud9
zulip-cloud9 provides a wrapper for running zulip dev environment on cloud9.

## Usage

### Install
Make sure zulip's virtual enviorment is activated and you are in home directory.
Then download and link package manually since `npm i -g zulip-cloud9` does not work in zulip's virtual enviorment.
```bash
npm i zulip-cloud9
npm ls    # link the module to bin manually
```

```
zulip-dev <command>

Commands:
  zulip-dev start           Start zulip-dev server on http://0.0.0.0
  zulip-dev start-services  Start all the required services for zulip.

Options:
  --version   Show version number                                      [boolean]
  --help, -h  Show help                                                [boolean]

```
Then default zulip path is `/home/ubunutu/workspace/zulip` top level zulip folder in c9 workspace.

### `zulip-dev start`
This starts the dev enviorment. This command exports `EXTERNAL_HOST` and handles if starts the services beforehand if needed to. This by default binds the host to `0.0.0.0` rather than `127.0.0.1` so it works on cloud9 and sets the port to `8080`.

### `zulip-dev start-services`
This script starts all the services only if needed. You can run this script if you encounter an error's documented in [TOOD: Document errors]
