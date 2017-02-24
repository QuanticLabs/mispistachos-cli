
var gcloud = require(__base+'utilities/gcloud.js')
var Bitbucket = new require(__base+'utilities/bitbucket.js')
var bitbucket = new Bitbucket(process.cwd())

var Utils = function(){

  // this.getProject = function(userProjectFlagValue){
  //   //Default: Current gcloud Project 
  //   var projectName = null
  //   if(!!userProjectFlagValue && userProjectFlagValue !== true){
  //     projectName = userProjectFlagValue
  //   }else{
  //     projectName = gcloud.getCurrentProject();
  //   }

  //   return projectName
  // }

  this.getContainer = function(userContainerFlagValue){
    var containerName = null

    if(!!userContainerFlagValue && userContainerFlagValue !== true){
      containerName = userContainerFlagValue
    }else{
      console.log("Container not specified. Using the current repository name")
      containerName = bitbucket.repositoryName
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

}



module.exports = new Utils();