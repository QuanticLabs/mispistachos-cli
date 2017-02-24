var utils = require('./utils.js')
var k8s = require(__base+'utilities/k8s.js')
var cmd = require(__base+'utilities/cmd.js')

var run = function(command, userContainerFlagValue, userDeploymentFlagValue){
  var containerName = utils.getContainer(userContainerFlagValue)
  var deploymentName = utils.getDeployment(userDeploymentFlagValue)


  console.log("Searching pod for container '"+containerName+"'")

  var podName = utils.getPod(containerName, deploymentName)

  var command = utils.refactorCommand(command)

  var fullCommand = "kubectl exec -it "+podName+" -c "+containerName+" "+command
  console.log("Executing command:")
  console.log("  " + fullCommand)
  console.log("")
  console.log("")

  var spawn = require('child_process').spawn;

  var params = ['exec', '-it', podName, '-c', containerName]
  params = params.concat(command.split(" "))

  var child = spawn('kubectl', params, {stdio: [0, 1, 2]});

}

var load= function(program){
  program
  .command('run <COMMAND> [PARAMS...]')
  .description('Run "bundle exec .." commands in the container')
  .action(function(command, params){

    var ps = params || []
    ps.unshift(command)
    var fullCommand = ps.join(" ")
    run(fullCommand, program.container, program.deployment)
  })
  .on('--help', function(){
    console.log("    Check 'mp k -h' for global options")
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ mp k run rake db:migrate                                # Run the command in (current project, any deployment, container "repoName")');
    console.log('    $ mp k run rails c -d deployName                          # Run the command in (current project, deployment "deployName", container "repoName")');
    console.log('    $ mp k run rake db:create -c containerName                # Run the command in (current project, any deployment, container "containerName")');
    console.log('    $ mp k run bundle install -d deployName -c containerName  # Run the command in (current project, deployment "deployName", container "containerName")');
    console.log('')
    console.log('    To change the current project, look:')
    console.log('      $ mp p set -h')
    console.log('');
  });
}
module.exports = load
