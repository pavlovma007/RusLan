#!/bin/bash
# commands from https://www.digitalocean.com/community/tutorials/typescript-new-project
sudo npm install -g nodemon

cd src  &&  rlwrap  node inspect index.js

cd src
npx tsc -w  # wait and compile

