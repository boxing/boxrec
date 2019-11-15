#!/bin/sh

 # Only push to Coveralls if we have the repo token
 # This fixes the issue where forked pull requests come in and circleci breaks when trying to push to Coveralls
 # This issue was seen with this https://github.com/boxing/boxrec/pull/231
 # CircleCI currently doesn't really support a way to check for the setting on an environment variable
 # therefore we do the work inside this script
if [ -z $COVERALLS_REPO_TOKEN ]; then
  cat ./coverage/lcov.info | yarn coveralls
  echo "Coverage report sent to Coveralls!"
else
  echo "Coverage report not sent to Coveralls.  This could be caused by a fork making a merge request or the env var not being set"
fi
