var BitbucketPipeline = require(__base+'utilities/bitbucket-pipelines.js')

var run = function(teamId,repositoryId){
  
  bitbucketPipeline = new BitbucketPipeline(teamId)
  if(!!teamId && !!repositoryId)
    bitbucketPipeline.getRepositoryConfigVariables(repositoryId) 
  else if(!!teamId && !repositoryId)
    bitbucketPipeline.getTeamConfigVariables()
  else
    console.log("You must set one team and/or one respository")
}

var load= function(program){
  program
  .command('env')
  .description('Read bitbucket pipelines variables')
  .action(function(){
    run(program.team, program.repository)
  })
}
module.exports = load
