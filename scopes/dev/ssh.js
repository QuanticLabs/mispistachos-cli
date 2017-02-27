var cmd = require(__base+'utilities/cmd.js')
var userUtils = require(__base+'utilities/user.js')


var run = function(command, userContainerFlagValue){

  var containerName = userUtils.getContainer(userContainerFlagValue)

  var fullCommand = "docker-compose run --rm web bash"
  var params = ['run', '--rm', "web", "bash"]

  cmd.execRemote("docker-compose", params)
}
//docker-compose run --rm web /bin/bash

var load= function(program){
  program
  .command('ssh')
  .alias('bash')
  .description('SSH to a specific local container')
  .action(function(){
    run(program.container, program.deployment)
  })
  .on('--help', function(){
    console.log("    Check 'mp dev -h' for global options")
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ mp dev ssh                                       # SSH with container "repoName"');
    console.log('    $ mp dev ssh -c containerName                      # SSH with container "containerName"');
    console.log('')
    console.log('    To change the current project, look:')
    console.log('      $ mp p set -h')
    console.log('');
  });
}
module.exports = load
