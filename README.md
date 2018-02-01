# zulip-cloud9
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
If not `--zulip-path` is passed it checkes if the cwd is zulip then the default path `/home/ubuntu/workspace/zulip` this is the top level folder in your workspace.

### `zulip-dev start`
This starts the dev enviorment. This command exports `EXTERNAL_HOST` and handles if starts the services beforehand if needed to. This by default binds the host to `0.0.0.0` rather than `127.0.0.1` so it works on cloud9 and sets the port to `8080`.

### `zulip-dev start-services`
If you have not run `zulip-dev start` and you need to run provison use this command and then run provision.
This script starts all the services only if needed. You can run this script if you encounter an error's documented in [wiki](../../wiki/Errors)

Errors you can encounter in cloud9 workspace while working with zulip dev enviorment are documented in [wiki](../../wiki/Errors)

## Weird webapp error
If you get a error here are steps you should follow:
* If you did not run `zulip-dev start` yet run `zulip-dev start-services`. 
* Run provision `./tools/provision`.  

You need to run provision often because in these cases, since currently `zulip-dev start` does not check provision number. If the issue presist check the errors wiki and open an issue.

