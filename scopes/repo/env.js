var BitbucketPipeline = require(__base+'utilities/bitbucket-pipelines.js')
var utils = require('./utils.js')


var run = function(userTeamFlagValue,userRepoFlagValue){

  var teamId = utils.getTeam(userTeamFlagValue)
  var repoId = utils.getRepo(userTeamFlagValue,userRepoFlagValue)

  console.log("Target team: "+teamId)
  console.log("Target repo: "+repoId)


  var bitbucketPipeline = new BitbucketPipeline(teamId, repoId)

  bitbucketPipeline.getConfigVariables() 
  
}

var load= function(program){
  program
  .command('env')
  .description('Read bitbucket pipelines variables')
  .action(function(){
    run(program.team, program.repository)
  })
  .on('--help', function(){
    console.log("    Check 'mp r -h' for global options")
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ mp r env                         # Show env variables for current team-repo');
    console.log('    $ mp r env -t                      # Show env variables for current team');
    console.log('    $ mp r env -t teamName             # Show env variables for team "teamName" ');
    console.log('    $ mp r env -t teamName -r repoName # Show env variables for repo "repoName" in team "teamName" ');
    console.log('');
  });
}
module.exports = load
