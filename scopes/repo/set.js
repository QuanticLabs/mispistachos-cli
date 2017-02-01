var BitbucketPipeline = require(__base+'utilities/bitbucket-pipelines.js')
var Yaml = require(__base+'utilities/yaml.js')

var run = function(teamId,repositoryId){
  
  bitbucketPipeline = new BitbucketPipeline(teamId)
  
  if(!!teamId && !!repositoryId){
    // bitbucketPipeline.getRepositoryConfigVariables(repositoryId) 
  }
  else if(!!teamId && !repositoryId){
    console.log("Updating environment variables to team "+teamId)
    var configPath = process.cwd()+"/config/bitbucket.yml"
    var yaml = new Yaml(configPath)
    yaml.load()
    console.log("\nVariables to set:")
    yaml.print()
    console.log("")
    var variables = yaml.values

    var variablesHash = bitbucketPipeline.getTeamConfigVariables(false)
    var keys = Object.keys(variables)
    for(var i = 0 ; i< keys.length ; i++){
      var key = keys[i]
      bitbucketPipeline.setTeamConfigVariable(key,variables[key],variablesHash)      
    }
  }
  else{
    console.log("You must set one team and/or one respository")
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
