var Bitbucket = new require(__base+'utilities/bitbucket.js')
var BitbucketPipeline = new require(__base+'utilities/bitbucket-pipelines.js')
var cmd = require(__base+'utilities/cmd.js')
var prompt = require(__base+'utilities/prompt.js')
var config = require(__base+'utilities/config.js')

var run = function(projectName, teamId){
  
  var userPath = process.cwd()

  if(!teamId){
      console.log("Enter the id of the bitbucket team that will work on the project.\n\
If you have not created it yet, you can do here:\n\
\thttps://bitbucket.org/account/create-team/?team_source=header")
      teamId = prompt.input("Team ID: ")
    }


  if(!teamId || teamId.length === 0){
    console.log("Team name empty")
    process.exit()
  }

  var projectPath = userPath + "/" + projectName
  var bitbucket = new Bitbucket(projectPath); 
  var bitbucketPipeline = null
  if(!bitbucket.touchTeam(teamId)){
    console.log("Team doesn't exists")  
    process.exit()
   }else{
    bitbucketPipeline = new BitbucketPipeline(teamId); 
    console.log("Team fetched from bitbucket")  
   }

  if (bitbucket.cloneDefaultInit(projectName)){
    bitbucket.addRemote("defaultinit", config.values.cli.defaultInit)

    // var repositoryName = projectName.replace(/\W/g, '').toLowerCase()
    var repositoryName = "dev"
    if(bitbucket.createRemoteRepository(teamId, repositoryName)){
      bitbucket.addRemote("origin", "git@bitbucket.org:"+teamId+"/"+repositoryName+".git")
      bitbucket.updateSubmodules()


      var submoduleNames = bitbucket.getSubmoduleNames()

      for(var i = 0; i< submoduleNames.length; i++){
        var submoduleName = submoduleNames[i]
        if(bitbucket.createRemoteRepository(teamId, submoduleName)){
          var repoUrl = "git@bitbucket.org:"+teamId+"/"+submoduleName+".git"
          bitbucket.setSubmoduleOrigin(submoduleName, repoUrl)
          
        }
      }
      bitbucket.syncSubmodules()

      for(var i = 0; i< submoduleNames.length; i++){
        var submoduleName = submoduleNames[i]
        bitbucket.pushSubmodule(submoduleName)
        bitbucketPipeline.enablePipelinesForRepository(submoduleName)
      }

      bitbucket.pushProject()

    }
  }

}

var load= function(program){
  program
  .command('new <PROJECT_NAME>')
  .description('Clone default init, push to a new bitbucket repository and add them to origin')
  .action(function(projectName){
    run(projectName)
  })
}

module.exports = load