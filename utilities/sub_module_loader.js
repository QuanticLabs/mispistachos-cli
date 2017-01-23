#!/usr/bin/env node


var load = function(program, subModule){

  program
  .command(subModule.name)
  .description(subModule.generalHelp)
  .on('--help', function(){
    subModule.help();
  })
  .action(function(cmd){
    subModule.exec(cmd)
  })

 
}

module.exports = load