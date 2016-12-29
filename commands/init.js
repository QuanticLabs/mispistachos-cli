#!/usr/bin/env node
var exec = require('executive');
var co = require('co');
var prompt = require('co-prompt');

var init = function (program, sem) {

  // Load other files
  var check_dependencies = require("../utilities/check_dependencies.js");
  var check = new check_dependencies(sem);

  var self = this;

  self.run = function (){
    // Check dependencies (git, gcloud, kubectl)
    sem.take(1, check.git)
    sem.take(1, check.docker)
    sem.take(1, check.dockerCompose)

    // We get the necessary info
    sem.take(1, self.getEnvPass)
    sem.take(1, self.getRepoFromRemote)

    // console.log(chalk.bold.green('str: ')+'test');
    // program.base
  }

  self.getEnvPass = function (){
    var lock = false;
    co(function *() {
      program.env_pass = yield prompt.password('Type the password for your environment variables: ');

      // VALIDATE AND CONTINUE
      if(!program.env_pass || program.env_pass==""){
        console.log('Error: No password found.')
      }
      else{
        sem.leave([1])
      }
    })
  }

  // Gets the BitBucket Team or Github Organization and the current project from the remote
  self.getRepoFromRemote = function (){
    exec.quiet('git remote -v | grep '+program.remote, function(err, stdout, stderr) {
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
      }
      else{
        sem.leave([1])
      }
    })
  }

}


module.exports = init;
