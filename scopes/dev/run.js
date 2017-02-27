var cmd = require(__base+'utilities/cmd.js')
var userUtils = require(__base+'utilities/user.js')

var run = function(command, userContainerFlagValue){

  var containerName = userUtils.getContainer(userContainerFlagValue)
  var command       = userUtils.refactorCommand(command)

  var fullCommand = "docker-compose exec "+containerName+" "+command
  console.log("Executing command:")
  console.log("  " + fullCommand)
  console.log("")
  console.log("")

  var params = ['run', containerName]
  params = params.concat(command.split(" "))

  cmd.execRemote("docker-compose", params)

}
//docker-compose run --rm web /bin/bash

var load= function(program){
  program
  .command('run <COMMAND> [PARAMS...]')
  .description('Run "bundle exec .." commands in the local container')
  .action(function(command, params){
    var ps = params || []
    ps.unshift(command)
    var fullCommand = ps.join(" ")
    run(fullCommand, program.container, program.deployment)
  })
  .on('--help', function(){
    console.log("    Check 'mp dev -h' for global options")
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ mp dev run rake db:migrate                                # Run the command in (container "repoName")');
    console.log('    $ mp dev run rake db:create -c containerName                # Run the command in (container "containerName")');
    console.log('')
  });
}

module.exports = load