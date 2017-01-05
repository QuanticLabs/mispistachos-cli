#!/usr/bin/env node
var chalk = require('chalk');
var exec = require('executive');
var sync_exec = require('sync-exec');
var co = require('co');
var program = require('commander');
var sem = require('semaphore')(1);

// Load other files
var cmd_init = require("./commands/init.js");
var init = new cmd_init(program, sem);

// Main program
program
  .version('0.0.1')
  .option('-b, --base <base>', 'Use a specific base project. (https://bitbucket.org/rails5docker/dev)', 'https://bitbucket.org/rails5docker/dev')
  .option('-r, --remote <remote>', 'Use a specific remote. (origin)', 'origin')
  .option('-p, --project <project>', 'Use a specific project. (default-project)', 'default-project')

program
  .command('init')
  .description('Run interactive setup commands.')
  .action(function(options){
    init.run()
  })

// Example
program
  .command('print <str>')
  .description('Print random string.')
  .option('-o, --opt <opt>', 'Custom option.')
  .action(function(str, options){
    console.log(chalk.bold.green('str: ')+str);
    co(function *() {
      var username = yield prompt('username: ');
      var password = yield prompt.password('password: ');
      console.log('user: %s pass: %s',
        username, password);
    })
  })

// Wrap up all the commands
program.parse(process.argv);

