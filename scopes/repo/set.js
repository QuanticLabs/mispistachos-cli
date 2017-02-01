var BitbucketPipeline = require(__base+'utilities/bitbucket-pipelines.js')
var Yaml = require(__base+'utilities/yaml.js')

var run = function(teamId,repositoryId){
  
  bitbucketPipeline = new BitbucketPipeline(teamId)
  

  var configPath = process.cwd()+"/config/bitbucket.yml"
  var variablesHash = null
  var updateFunc = null
  if(!!teamId && !!repositoryId){
    // bitbucketPipeline.getRepositoryConfigVariables(repositoryId) 
    console.log("Updating environment variables to repo "+teamId+"/"+repositoryId)
    
    variablesHash = bitbucketPipeline.getRepositoryConfigVariables(repositoryId,false)
    updateFunc = bitbucketPipeline.setRepositoryConfigVariable
    
  }
  else if(!!teamId && !repositoryId){
    console.log("Updating environment variables to team "+teamId)
    variablesHash = bitbucketPipeline.getTeamConfigVariables(false)
    updateFunc = bitbucketPipeline.setTeamConfigVariable
  }
  else{
    console.log("You must set one team and/or one respository")
    return
  }

  var yaml = new Yaml(configPath)
  yaml.load()
  console.log("\nVariables to set:")
  yaml.print()
  console.log("")
  var variables = yaml.values

  var keys = Object.keys(variables)
  for(var i = 0 ; i< keys.length ; i++){
    var key = keys[i]
    if(!!repositoryId)
      updateFunc(repositoryId,key,variables[key],variablesHash)      
    else
      updateFunc(key,variables[key],variablesHash)      

  }



}

var load= function(program){
  program
  .command('set')
  .description('Update bitbucket pipelines variables from config/bitbucket.yml file')
  .action(function(){
    run(program.team, program.repository)
  })
}
module.exports = load
