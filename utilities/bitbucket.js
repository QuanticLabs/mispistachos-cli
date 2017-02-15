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

var Bitbucket = function(projectPath){
  
  this.projectPath = projectPath

  var team = null
  var repository = null

  var cmdInProjectPath = function(command, callback){
    cmd.sync("\
      cd "+ projectPath +" && \
      "+command, callback)
  }


  cmdInProjectPath("git remote -v", function(err, stdout, stderr){
    var matches = stdout.match(/origin.+git@.+:(.+)\/(.+)\./i)
    if(matches!=null){
      team = matches[1]
      repository = matches[2]
    }
  })

  this.teamName = team
  this.repositoryName = repository

  var bbCommand = function (bitbucketCommand, callback, projectFolder=true){
    var command = "BITBUCKET_KEY="+config.values.bb.key+" BITBUCKET_SECRET="+config.values.bb.secret+" "+binPath+" "+bitbucketCommand
    if(projectFolder)
      cmdInProjectPath(command, callback)
    else
      cmd.sync(command, callback)
  }

  this.cloneDefaultInit = function(){
    if(!!projectPath){
      if(!fileUtils.exists(projectPath)){
        console.log("Cloning project")
        cmd.sync("git clone "+config.values.cli.defaultInit+" "+projectPath, nothing)
        console.log("Project clone finished")
        return true
      }else{
        console.log("ERROR: Folder '"+projectPath+"' exists")
      }
      
    }

    return false
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
    },false)
    return teamExist
  }

  this.addRemote = function(remoteName, gitUrl){

    this.removeRemote(remoteName)
    cmdInProjectPath("git remote add "+remoteName+" "+gitUrl, print)
    console.log("Remote '"+remoteName+"' added")
  }

  this.createRemoteRepository= function(projectTeamId, repositoryName){
    var created = false
    bbCommand("create-repository -p "+projectTeamId+" "+repositoryName,function(err, stdout, stderr){
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

  this.updateSubmodules= function(){
    console.log("Initializing submodules")
    cmdInProjectPath("git submodule init && git submodule update",print)
  }

  this.setSubmoduleOrigin = function(submoduleName, gitNewOrigin){
   cmdInProjectPath("git config --file=.gitmodules submodule."+submoduleName+".url "+gitNewOrigin)
  }

  this.syncSubmodules = function(){
    console.log("Synchronizing submodules")
    cmdInProjectPath("git submodule sync && \
      git submodule update --init --recursive --remote")
    console.log("Submodules Synchronized")

  }

  this.pushSubmodule = function(submoduleName){
    console.log("Pushing submodule '"+submoduleName+"' to a new repository")
    cmdInProjectPath("cd "+submoduleName+" && \
      git add --all && \
      git commit -m 'first commit'",print)

    cmdInProjectPath("cd "+submoduleName+" && \
      git push origin master",print)
  }

  this.pushProject = function(){
    console.log("Pushing project to the new repository")
    cmdInProjectPath("git add --all && \
      git commit -m 'first commit'",print)

    cmdInProjectPath("git push origin master",print)
  }

  this.getSubmoduleNames = function(){
    console.log("Fetching submodules")
    var submodules = []
    cmdInProjectPath("git config --file .gitmodules --get-regexp path | awk '{ print $2 }'", function(err, stdout, stderr){
      if(checkError(err,stdout,stderr)){
        print("Error fetching submodules")
      }
      submodules = stdout.split("\n")
      submodules = submodules.diff([""])
    })
    console.log("\t"+submodules+" found")
    return submodules
  }

  this.removeRemote = function(remoteName){
    cmdInProjectPath("git remote rm "+remoteName, nothing)
    console.log("Remote '"+remoteName+"' removed")
  }


  this.changeOauth = function(){
    console.log("\n")

    var username = prompt.input("Type your bitbucket username: ")
    console.log("Enter your bitbucket OAuth credentials. You can find them here:")
    console.log("https://bitbucket.org/account/user/"+username+"/api")
    console.log("Warning: You MUST set the variable Callback URL")
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

  this.getTeamName = function(){

  }

  this.getSubmoduleName = function(){

  }

  var checkError = function(err, stdout, stderr){
    if(stdout.indexOf("Error: ") > -1 || !!err || !!stderr){
      return true
    }
    return false
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

module.exports = Bitbucket