var cmd = require(__base+'utilities/cmd.js')
var userUtils = require(__base+'utilities/user.js')

var run = function(userContainerFlagValue, newContainerFlagValue, linesToShow){

  var containerName = userUtils.getContainer(userContainerFlagValue)

  var fullCommand = null
  var params = null
  var lines = linesToShow || 20
  fullCommand = "docker-compose logs -f --tail="+lines+" "+containerName
  params = ['logs', '-f', '--tail='+lines, containerName]

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
  .option("-l, --lines [lines]", "Lines number to show")
  .description('View development log file')
  .action(function(params, command){
    run(program.container, program.new, command.lines)
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