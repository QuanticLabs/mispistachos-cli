#!/usr/bin/env node
var exec = require('executive');
var co = require('co');
var _prompt = require('../utilities/prompt.js');
var _cmd = require('../utilities/cmd.js');

var init = function (program, sem) {

  // Load other files
  var check_dependencies = require("../utilities/check_dependencies.js");
  var check = new check_dependencies(sem);
  var prompt = new _prompt.Prompt()
  var cmd = new _cmd.Cmd()
  var self = this;

  self.run = function (){

    cmd.sync("cat /Users/gslopez/.ssh/id_rsa", function(a,b,c){
      console.log(a)
      console.log(b)
      console.log(c)
    })
    // // Check dependencies (git, gcloud, kubectl)
    // check.git()
    // check.docker()
    // check.dockerCompose()

    // // We get the necessary info
    // self.getEnvPass()
    // self.getRepoFromRemote()
    
  }

  self.getEnvPass = function (){

    var password = prompt.password('Type the password for your environment variables: ')
    if (password==null || password ==""){
      console.log("Error: Invalid password")
      process.exit()
    }
    program.env_pass = password

  }

  // Gets the BitBucket Team or Github Organization and the current project from the remote
  self.getRepoFromRemote = function (){
    cmd.sync('git remote -v | grep '+program.remote, function(err, stdout, stderr) {
      var remotes = stdout.split('\n')
      var remote = remotes[0];
      // Ex: origin git@github.com:MisPistachos/mispistachos-cli.git (fetch)
      // Ex: origin git@bitbucket.org:MisPistachos/mispistachos-cli.git (fetch)
      var offset_host = remote.indexOf("git@")
      var offset_middle = remote.indexOf(":", offset_host)
      var offset_end = remote.indexOf("/",offset_middle)
      program.team = remote.substr(offset_middle+1,offset_end-offset_middle-1)
      // Ex: MisPistachos
      var offset_repo = remote.indexOf(".git",offset_end)
      program.repo = remote.substr(offset_end+1,offset_repo-offset_end-1)
      // Ex: mispistachos-cli
      
      // VALIDATE AND CONTINUE
      if(!program.repo){
        console.log('Error: No repository found.')
        process.exit()
      }
    })
  }

}


module.exports = init;
