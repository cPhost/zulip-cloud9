# contributing to zulip-cloud9
This guide will take you though the contributing process.

#### Step 1: Fork the repo and clone
Fork this repo on github and then clone it locally.
```
git clone git@github.com:<your-username>/zulip-cloud9.git
cd zulip-cloud9
git remote add upstream git@github.com:cPhost/zulip-cloud9.git 
```

#### Step 2: Create a branch and start hacking
Create a branch for the feature you plan to work on:
```
git checkout -b <feature-branch-name> 
```

#### Step 3: commit and commit guidelines
We follow [zulip's commit guidelines](http://zulip.readthedocs.io/en/latest/contributing/version-control.html). 
So keep that in mind when commiting.

#### Step 4: Updating your branch
Use rebase workflow not:
```
git pull upstream master ---rebase
```

#### Testing and lastly send us your code
We do have a  `start-services` test, but its too slow so you may go
ahead and test it manually.

To run tests it manually
```
# first run linter test, by default run the fix version
# you it goes ahead a fixes whatever it can
npm run lint-fix 
# then run the start services test
sudo service memcached stop
sudo service rabbitmq-server stop
sudo service redis-server top
sudo service postgresql stop

# then run
./bin/zulip-dev start-services # it should have started all the services
# to confirm
./bin/zulip-dev start
```

To run the test nonetheless:
```
npm run test
./bin/zulip-dev start # make sure every thing works.
```

If your tests are all good to go push your branch
```
git push origin <feature-branch>
# if you made any changes to git history
git push origin +<feature branch>
```
And open a PR by visiting https://github,com/<your-username>/zulip-cloud9, 
then selecting the branch and clicking 'Pull Request' button.

