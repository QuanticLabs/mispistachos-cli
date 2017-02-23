var BitbucketPipeline = require(__base+'utilities/bitbucket-pipelines.js')
var utils = require('./utils.js')


var run = function(userTeamFlagValue,userRepoFlagValue){

  var teamId = utils.getTeam(userTeamFlagValue)

  var repoId = utils.getRepo(userTeamFlagValue,userRepoFlagValue)
  

  console.log("Target team: "+teamId)
  console.log("Target repo: "+repoId)


  var bitbucketPipeline = new BitbucketPipeline(teamId)
  if(!!teamId && !!repoId)
    bitbucketPipeline.getRepositoryConfigVariables(repoId) 
  else if(!!teamId && !repoId)
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
