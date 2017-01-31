#!/usr/bin/env node

var cmd = require(__base+'utilities/cmd.js')
var config = require(__base+'utilities/config.js');
var prompt = require(__base+'utilities/prompt.js');
var fileUtils = require(__base+'utilities/file_utils.js');
var binPath = __base+"node_modules/bitbucket-cli/bin/bitbucket"

var project = function(id, name, number){
  this.id = id;
  this.name = name;
  this.number = number
}

var Bitbucket = function(){
  

  this.cloneDefaultInit = function(projectFolderPath, projectName){
    if(!!projectName){
      if(!fileUtils.exists(projectFolderPath+"/"+projectName)){
        console.log("Cloning project")
        cmd.sync("git clone "+config.values.cli.defaultInit+" "+projectName, nothing)
        console.log("Project clone finished")
        return true
      }else{
        console.log("ERROR: Folder '"+projectName+"' exists")
      }
      
    }

    return false
  }


  var bbCommand = function (bitbucketCommand, callback){
    var command = "BITBUCKET_KEY="+config.values.bb.key+" BITBUCKET_SECRET="+config.values.bb.secret+" "+binPath+" "+bitbucketCommand
    // console.log(command)
    cmd.sync(command, callback)
  }

  this.touchTeam = function(teamName){
    var teamExist = false
    bbCommand("team "+teamName,function(err, stdout, stderr){
      // console.log('TEST')
      // print(err,stdout,stderr)
      if(stdout.indexOf("Error: ") > -1){
        teamExist = false
      }else{
        teamExist = true
      }

      print(err, stdout, stderr)
    })
    return teamExist
  }

  this.addRemote = function(projectPath, remoteName, gitUrl){

    this.removeRemote(projectPath, remoteName)
    cmd.sync("\
      cd "+projectPath+" && \
      git remote add "+remoteName+" "+gitUrl, print)

    console.log("Remote '"+remoteName+"' added")
  }

  this.createRemoteRepository= function(projectTeamId, repositoryName){
    var created = false
    bbCommand("create-repository "+projectTeamId+" "+repositoryName,function(err, stdout, stderr){
      // console.log('TEST')
      // print(err,stdout,stderr)
      if(stdout.indexOf("Error: ") > -1){
        created = false
      }else{
        created = true
      }

      print(err, stdout, stderr)
    })

    return created
  }

  this.removeRemote = function(projectPath, remoteName){

    cmd.sync("cd "+projectPath+" && \
      git remote rm "+remoteName, nothing)
    console.log("Remote '"+remoteName+"' removed")
  }


  this.changeOauth = function(){
    console.log("\n")

    var username = prompt.input("Type your bitbucket username: ")
    console.log("Enter your bitbucket OAuth credentials. You can find them here:")
    console.log("https://bitbucket.org/account/user/"+username+"/api")
    var key = ""
    var secret = ""
    if(checkInput(username)){
      key = prompt.input("Type your bitbucket key: ")
      secret = prompt.input("Type your bitbucket secret: ")
    }else{
      console.log("Invalid username")
      process.exit()
    }
    

    if(checkInput(key) && checkInput(secret)){
      config.values.bb.username = username
      config.values.bb.key = key
      config.values.bb.secret = secret
      config.save("bb")  
      console.log("Credentials updated")
    }else{
      console.log("Invalid credentials")
      process.exit()
    }
    
  }

   var print = function(err, stdout, stderr){
    if(!!err){
      // console.log("err");
      console.log(err);
    }
    if(!!stdout){
      // console.log("stdout");
      console.log(stdout);
    }
    if(!!stderr){
      // console.log("stderr");
      console.log(stderr);
    }
  }

  var nothing =function(err, stdout, stderr){
    
  }

  var checkInput = function(input){
    if(!!input && input.length>0){
      return true
    }else{
      return false
    }
  }
}

module.exports = new Bitbucket()