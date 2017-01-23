#!/usr/bin/env node


var load = function(program, subModule){

  program
  .command(subModule.name)
  .alias(subModule.alias)
  .description(subModule.generalHelp)
  .on('--help', function(){
    subModule.help();
  })
  .action(function(cmd){
    subModule.exec(cmd, arguments)
  })

 
}

module.exports = load