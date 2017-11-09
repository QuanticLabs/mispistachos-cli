var cmd = require(__base+'utilities/cmd.js')
var userUtils = require(__base+'utilities/user.js')

var run = function(userContainerFlagValue, newContainerFlagValue){

  var containerName = userUtils.getContainer(userContainerFlagValue)
  var command       = "tail -f log/development.log"


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
  .command('logs [PARAMS...]')
  .description('View development log file')
  .action(function(params){
    run(program.container, program.new)
  })
  .on('--help', function(){
    console.log("    Check 'mp dev -h' for global options")
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ mp dev logs -c web                           # Run the command in an existent container "web"');
    console.log('')
  });
}

module.exports = load