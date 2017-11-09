var cmd = require(__base+'utilities/cmd.js')
var docker = require(__base+'utilities/docker.js')
var userUtils = require(__base+'utilities/user.js')

var run = function(userContainerFlagValue){

  var containerName = userUtils.getContainer(userContainerFlagValue)
  containerName = docker.getPodNames(containerName)
  var command       = "docker attach "+containerName


  var fullCommand = command

  console.log("Executing command:")
  console.log("  " + fullCommand)
  console.log("")
  console.log("")

  cmd.execRemote("docker", ["attach", containerName])

}
//docker-compose run --rm web /bin/bash

var load= function(program){
  program
  .command('attach [PARAMS...]')
  .description('Attach this console to container console')
  .action(function(params){
    run(program.container)
  })
  .on('--help', function(){
    console.log("    Check 'mp dev -h' for global options")
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ mp dev attach -c web                           # Attach to container web');
    console.log('')
  });
}

module.exports = load