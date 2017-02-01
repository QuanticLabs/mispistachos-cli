var BitbucketPipeline = require(__base+'utilities/bitbucket-pipelines.js')
var Bitbucket = require(__base+'utilities/bitbucket.js')
var Yaml = require(__base+'utilities/yaml.js')

var run = function(teamId,repositoryId, key){
  

  var bitbucket = new Bitbucket(process.cwd())
  if(!teamId){
    teamId = bitbucket.teamName
  }

  if(!repositoryId){
    repositoryId = bitbucket.repositoryName
  }
  bitbucketPipeline = new BitbucketPipeline(teamId)
  var configPath = process.cwd()+"/config/bitbucket.yml"
  var variablesHash = null
  if(!!teamId && !!repositoryId){
    // bitbucketPipeline.getRepositoryConfigVariables(repositoryId) 
    console.log("Updating environment variables to repo "+teamId+"/"+repositoryId)
    
    variablesHash = bitbucketPipeline.getRepositoryConfigVariables(repositoryId,false)
    
  }
  else if(!!teamId && !repositoryId){
    console.log("Updating environment variables to team "+teamId)
    variablesHash = bitbucketPipeline.getTeamConfigVariables(false)
  }
  else{
    console.log("You must set one team and/or one respository")
    return
  }

  var yaml = new Yaml(configPath)
  yaml.load()
  var variables = yaml.values

  var keys = Object.keys(variables)
  // for(var i = 0 ; i< keys.length ; i++){
    
    if(!!repositoryId){
      bitbucketPipeline.unsetRepositoryConfigVariable(repositoryId,key,variablesHash)      
    }
    else{
      bitbucketPipeline.unsetTeamConfigVariable(key,variablesHash)      
    }

  // }



}

var load= function(program){
  program
  .command('unset <KEY>')
  .description('Delete bitbucket pipelines variable')
  .action(function(key){
    run(program.team, program.repository, key)
  })
}
module.exports = load
