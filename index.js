#!/usr/bin/env node
var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');

// Main program
program
  .version('0.0.1')
  .option('-p, --project <project>', 'Switch to project before executing.', 'default')

program
  .command('init')
  .description('Run interactive setup commands.')
  .option('-o, --opt <opt>', 'Custom option.')
  .action(function(options){
    var opt = options.opt || "default-opt";
    console.log(opt)
    init(program.project)
  })

function init(project){
  co(function *() {
    var username = yield prompt('username: ');
    var password = yield prompt.password('password: ');
    console.log('user: %s pass: %s project: %s',
      username, password, project);
  })
}

program
  .command('print <str>')
  .description('Print random string.')
  .action(function(str, options){
    console.log('str: %s', str);
  })

// Wrap up all the commands
program.parse(process.argv);

