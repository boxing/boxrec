#!/usr/bin/env bash
# cd ./docs
# mv index.html home.html
echo '<?php include_once("./docs/index.html"); ?>' > index.php
echo '{}' > composer.json