var BitbucketPipeline = require(__base+'utilities/bitbucket-pipelines.js')
var Bitbucket = require(__base+'utilities/bitbucket.js')
var Yaml = require(__base+'utilities/yaml.js')
var utils = require('./utils.js')

var run = function(userTeamFlagValue,userRepoFlagValue, key){
  

  var teamId = utils.getTeam(userTeamFlagValue)
  var repoId = utils.getRepo(userTeamFlagValue,userRepoFlagValue)
  
  bitbucketPipeline = new BitbucketPipeline(teamId, repoId)
  var configPath = process.cwd()+"/config/bitbucket.yml"
  var remoteVariablesHash = null
  console.log("Updating environment variables to "+bitbucketPipeline.getTeamRepoString())
  remoteVariablesHash = bitbucketPipeline.getConfigVariables(false)

  var yaml = new Yaml(configPath)
  yaml.load()
  var variables = yaml.values


  bitbucketPipeline.unsetConfigVariable(key,remoteVariablesHash)      
}

var load= function(program){
  program
  .command('unset <KEY>')
  .description('Delete bitbucket pipelines variable')
  .action(function(key){
    run(program.team, program.repository, key)
  })
  .on('--help', function(){
    console.log("    Check 'mp r -h' for global options")
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ mp r unset key                          # Unset variable "key" for current repo in current team');
    console.log('    $ mp r unset key -t                       # Unset variable "key" for current team');
    console.log('    $ mp r unset key -t teamName              # Unset variable "key" for team "teamName" ');
    console.log('    $ mp r unset key -t teamName -r repoName  # Unset variable "key" for repo "repoName" in team "teamName" ');
    console.log('');
  });
}
module.exports = load
