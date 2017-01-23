#!/usr/bin/env node
var prompt = require('../utilities/prompt.js');
var cmd = require('../utilities/cmd.js');
var config = require('../utilities/config.js');


var run = function (remote){

  config.checkConfigOrCreate()
  check("git", "git --version")
  check("docker", "docker -v")
  check("docker-compose", 'docker-compose -v')

  // We get the necessary info
  getEnvPass()
  getRepoFromRemote(remote)
  
}

var check = function (commandName, command){
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

  // Gets the BitBucket Team or Github Organization and the current project from the remote
  var getRepoFromRemote = function (remote){
    cmd.sync('git remote -v | grep '+remote, function(err, stdout, stderr) {
      var remotes = stdout.split('\n')
      var remote = remotes[0];

      // Ex: origin git@github.com:MisPistachos/mispistachos-cli.git (fetch)
      // Ex: origin git@bitbucket.org:MisPistachos/mispistachos-cli.git (fetch)
      var offset_host = remote.indexOf("git@")
      var offset_middle = remote.indexOf(":", offset_host)
      var offset_end = remote.indexOf("/",offset_middle)
      var team = remote.substr(offset_middle+1,offset_end-offset_middle-1)
      // Ex: MisPistachos
      var offset_repo = remote.indexOf(".git",offset_end)
      var repo = remote.substr(offset_end+1,offset_repo-offset_end-1)
      // Ex: mispistachos-cli
      
      // VALIDATE AND CONTINUE
      if(!repo){
        console.log('Error: No repository found.')
        process.exit()
      }else{
        console.log('Repository found')
      }
    })
  }





module.exports = run;
