var cmd = require(__base+'utilities/cmd.js')
var userUtils = require(__base+'utilities/user.js')


var run = function(userContainerFlagValue, newContainerFlagValue){

  var containerName = userUtils.getContainer(userContainerFlagValue)

  var fullCommand = null
  var params = null
  if(!!newContainerFlagValue){
    console.log('Creating a new container...')
    fullCommand = "docker-compose run --rm "+containerName+" bash"
    params = ['run', '--rm', containerName, "bash"]
  }else{
    console.log('Searching an existent container...')
    fullCommand = "docker-compose exec "+containerName+" bash"
    params = ['exec', containerName, 'bash']
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
