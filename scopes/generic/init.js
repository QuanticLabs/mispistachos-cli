#!/usr/bin/env node
var prompt = require(__base+'/utilities/prompt.js');
var cmd = require(__base+'/utilities/cmd.js');
var config = require(__base+'/utilities/config.js');
var bitbucket = require(__base+'/utilities/bitbucket.js');


var run = function (remote){

  config.checkConfigOrCreate()
  checkCommand("git", "git --version")
  checkCommand("docker", "docker -v")
  checkCommand("docker-compose", 'docker-compose -v')

  // We get the necessary info
  getEnvPass()
  bitbucket.changeOauth()
  // getRepoFromRemote(remote)
  
}

var checkCommand = function (commandName, command){
  cmd.sync(command, function(err, stdout, stderr) {
    if(err!=null){
      console.log('Error: \''+commandName+'\' not found')
      process.exit()
    }
    else{
      console.log('\''+commandName+'\' found')
    }

  })
}


  var getEnvPass = function (){
    var password = prompt.password('Type the password for your environment variables: ')
    if (password === null || password === ""){
      console.log("Error: Invalid password")
      process.exit()
    }else{
      config.values.cli.password = password
      config.save("cli")
      console.log("Password saved")

    }

  }


  

  var load= function(subProgram){
    subProgram
    .command('init')
    .description('Run setup commands')
    .action(function(options){
      run()
    })
  }




module.exports = load;
