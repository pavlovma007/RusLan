#!/bin/bash
# commands from https://www.digitalocean.com/community/tutorials/typescript-new-project
sudo npm install -g nodemon

#cd src       &&     nodemon index.js
#cd src  &&  rlwrap  node inspect index.js

cd src
npx tsc -w  caspaxos2.ts       # wait and compile
npx nodemon  caspaxos2.js

