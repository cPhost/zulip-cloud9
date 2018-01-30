# zulip-cloud9
zulip-cloud9 provides a wrapper for running zulip dev environment on cloud9.

## Usage
```
  zulip-dev <commands> [flags]
  This script is for use in a cloud9 workspace

  commands
  ------------------------
  -h, --help, help         Display help (this message)
  provision                Runs zulip's provison
  start                    Starts the dev enviorment for cloud9
  start-services           Starts all the service's required for zulip dev enviorment

  Optional Flags for provision, and start:
  [-z] [--zulip-path]      Optional flag zulip path if not installed at
                           ~/workspace/zulip
  -- <flags>               Everything after -- will be passed to ./tools/run-dev or
                           ./tools/provision script.
```
Then default zulip path is `/home/ubunutu/workspace/zulip` top level zulip folder in c9 workspace.

### `zulip-dev provision`
This runs the provision script and handles any error is ocurrs. This is recommended if you run it the first time you are provision. If you already ran `zulip-dev start-services` you can just run `./tools/provision`.

### `zulip-dev start`
This starts the dev enviorment. This command exports `EXTERNAL_HOST` and handles if starts the services beforehand if needed to. This by default binds the host to `0.0.0.0` rather than `127.0.0.1` so it works on cloud9 and sets the port to `8080`.

### `zulip-dev start-services`
This script starts all the services only if needed.
