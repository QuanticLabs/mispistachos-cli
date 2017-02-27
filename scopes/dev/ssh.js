var cmd = require(__base+'utilities/cmd.js')
var userUtils = require(__base+'utilities/user.js')


var run = function(userContainerFlagValue, newContainerFlagValue){

  var containerName = userUtils.getContainer(userContainerFlagValue)

  var fullCommand = null
  var params = null
  if(!!newContainerFlagValue){
    fullCommand = "docker-compose run --rm web bash"
    params = ['run', '--rm', "web", "bash"]
  }else{
    fullCommand = "docker-compose exec web bash"
    params = ['exec', 'web', 'bash']
  }
  console.log("Executing command:")
  console.log("  " + fullCommand)
  console.log("")
  console.log("")

  cmd.execRemote("docker-compose", params)

}
//docker-compose run --rm web /bin/bash

var load= function(program){
  program
  .command('ssh')
  .alias('bash')
  .description('SSH to a specific local container')
  .action(function(){
    run(program.container, program.new)

  })
  .on('--help', function(){
    console.log("    Check 'mp dev -h' for global options")
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ mp dev ssh                                       # SSH with an existent container "repoName"');
    console.log('    $ mp dev ssh -c containerName                      # SSH with an existent container "containerName"');
    console.log('    $ mp dev ssh -c containerName -n                   # SSH with a new container "containerName"');
    console.log('')
    console.log('    To change the current project, look:')
    console.log('      $ mp p set -h')
    console.log('');
  });
}
module.exports = load
