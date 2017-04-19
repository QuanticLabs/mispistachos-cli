var cmd = require(__base+'utilities/cmd.js')
var userUtils = require(__base+'utilities/user.js')

var run = function(command, userContainerFlagValue, newContainerFlagValue){

  var containerName = userUtils.getContainer(userContainerFlagValue)
  var command       = userUtils.refactorCommand(command)


  var fullCommand = null
  var params = null
  if(!!newContainerFlagValue){
    fullCommand = "docker-compose run --rm "+containerName+" "+command
    params = ['run', '--rm', containerName]
  }else{
    fullCommand = "docker-compose exec "+containerName+" "+command
    params = ['exec', containerName]
  }
  params = params.concat(command.split(" "))

  console.log("Executing command:")
  console.log("  " + fullCommand)
  console.log("")
  console.log("")

  cmd.execRemote("docker-compose", params)

}
//docker-compose run --rm web /bin/bash

var load= function(program){
  program
  .command('run <COMMAND> [PARAMS...]')
  .description('Run any command in the local container')
  .action(function(command, params){
    var ps = params || []
    ps.unshift(command)
    var fullCommand = ps.join(" ")
    run(fullCommand, program.container, program.new)
  })
  .on('--help', function(){
    console.log("    Check 'mp dev -h' for global options")
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ mp dev run rake db:migrate                                # Run the command in an existent (container "repoName")');
    console.log('    $ mp dev run rake db:create -c containerName                # Run the command in an existent (container "containerName")');
    console.log('    $ mp dev run rake db:seed -c containerName -n               # Run the command in a new (container "containerName")');
    console.log('')
  });
}

module.exports = load