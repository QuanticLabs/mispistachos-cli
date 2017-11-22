#!/usr/bin/env node
var gcloud = require(__base+'utilities/gcloud.js')
var Bitbucket = new require(__base+'utilities/bitbucket.js')
var k8s = new require(__base+'utilities/k8s.js')
var bitbucket = new Bitbucket(process.cwd())

var User = function(){

  this.refactorCommand = function(command){
    command = command.trim()
    var commands = command.split(" ")
    commands = commands.filter(function(c){ return !!c})
    
    //TODO: It could be dependent of the web container
    var refactoredCommand = ["bundle", "exec"]

    if(commands.length > 0 && commands[0].startsWith("rails") || commands[0].startsWith("rake")){
      for (var i = 0; i < commands.length; i++){
        var name = commands[i]
        if(name !== "bundle" && name !== "exec"){
          refactoredCommand.push(name)
        }
      }
      return refactoredCommand.join(" ")
    }

    
    
    return commands.join(" ")
  }

  this.getContainer = function(userContainerFlagValue){
    var containerName = null

    if(!!userContainerFlagValue && userContainerFlagValue !== true){
      containerName = userContainerFlagValue
    }else{
      containerName = bitbucket.repositoryName
      console.log("Container not specified. Using the current repository name: \""+containerName+"\"")

    }

    return containerName
  }


  this.getDeployment = function(userDeploymentFlagValue){
     var deploymentName = null

    if(!!userDeploymentFlagValue && userDeploymentFlagValue !== true){
      deploymentName = userDeploymentFlagValue
    }

    return deploymentName
  }

  this.getPod = function(containerName, deploymentName, namespace){
    var podNames = k8s.getPodNames(containerName, deploymentName, namespace)

  
    if(podNames.length == 0){
      console.log("Pod not found (1)")
      process.exit()
    }

    var podName = null
    console.log("podNames")
    console.log(podNames)
    if(podNames.length == 1){
      podName = podNames[0]
    }else{
      var webPodNames = podNames.filter(function(p){ return p.includes("web-")})
      if(webPodNames.length > 0){
        podName = webPodNames[0]
      }else{
        podName = podNames[0]
      }
    }

    if(!podName){
      console.log("Pod not found (2)")
      process.exit()
    }

    console.log("Pod '"+podName+"' found") 
    return podName
  }


}

module.exports = new User()