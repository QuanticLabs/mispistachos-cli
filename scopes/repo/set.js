var BitbucketPipeline = require(__base+'utilities/bitbucket-pipelines.js')
var Bitbucket = require(__base+'utilities/bitbucket.js')
var Yaml = require(__base+'utilities/yaml.js')
var utils = require('./utils.js')

var run = function(userTeamFlagValue,userRepoFlagValue){

  var teamId = utils.getTeam(userTeamFlagValue)
  var repoId = utils.getRepo(userTeamFlagValue,userRepoFlagValue)
  
  bitbucketPipeline = new BitbucketPipeline(teamId, repoId)
  var configPath = process.cwd()+"/config/bitbucket.yml"
  var remoteVariablesHash = null

  console.log("Updating environment variables to "+bitbucketPipeline.getTeamRepoString())
  remoteVariablesHash = bitbucketPipeline.getConfigVariables(false)
  if(!teamId){
    console.log("You must set one team and/or one respository")
    return
  }

  var yaml = new Yaml(configPath)
  yaml.load()
  console.log("\nVariables to set:")
  yaml.print()
  console.log("")
  var fileVariables = yaml.values

  var keys = Object.keys(fileVariables)
  for(var i = 0 ; i< keys.length ; i++){
    var key = keys[i]
    bitbucketPipeline.setConfigVariable(key,fileVariables[key],remoteVariablesHash)
  }
}

var load= function(program){
  program
  .command('set')
  .description('Update bitbucket pipelines variables from ./config/bitbucket.yml file')
  .action(function(){

    run(program.team, program.repository)
  })
  .on('--help', function(){
    console.log("    Check 'mp r -h' for global options")
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ mp set                         # Set env variables for current team-repo');
    console.log('    $ mp set -t                      # Set env variables for current team');
    console.log('    $ mp set -t teamName             # Set env variables for team "teamName" ');
    console.log('    $ mp set -t teamName -r repoName # Set env variables for repo "repoName" in team "teamName" ');
    console.log('');
  });
}
module.exports = load
