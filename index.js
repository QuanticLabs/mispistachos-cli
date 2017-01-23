#!/usr/bin/env node

//requires
var program = require('commander');

// Main program
program
  .version('0.0.1')
  .option('-b, --base <base>', 'Use a specific base project. (https://bitbucket.org/rails5docker/dev)', 'https://bitbucket.org/rails5docker/dev')
  .option('-r, --remote <remote>', 'Use a specific remote. (origin)', 'origin')
  .option('-p, --project <project>', 'Use a specific project. (default-project)', 'default-project')



var load = require('./commands/loader.js')

load(program)

program.parse(process.argv);

