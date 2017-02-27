var k8s = require(__base+'utilities/k8s.js')
var cmd = require(__base+'utilities/cmd.js')
var userUtils = require(__base+'utilities/user.js')

var run = function(command, userContainerFlagValue, userDeploymentFlagValue){
  var containerName = userUtils.getContainer(userContainerFlagValue)
  var deploymentName = userUtils.getDeployment(userDeploymentFlagValue)


  console.log("Searching pod for container '"+containerName+"'")

  var podName = userUtils.getPod(containerName, deploymentName)

  var command = userUtils.refactorCommand(command)

  var fullCommand = "kubectl exec -it "+podName+" -c "+containerName+" "+command
  console.log("Executing command:")
  console.log("  " + fullCommand)
  console.log("")
  console.log("")

  var params = ['exec', '-it', podName, '-c', containerName]
  params = params.concat(command.split(" "))
  cmd.execRemote('kubectl', params)

}

var load= function(program){
  program
  .command('run <COMMAND> [PARAMS...]')
  .description('Run "bundle exec .." commands in the remote container')
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
    console.log('    $ mp k run rake db:migrate                                # Run the command in (current project, any deployment         , container "repoName")');
    console.log('    $ mp k run rails c -d deployName                          # Run the command in (current project, deployment "deployName", container "repoName")');
    console.log('    $ mp k run rake db:create -c containerName                # Run the command in (current project, any deployment         , container "containerName")');
    console.log('    $ mp k run bundle install -d deployName -c containerName  # Run the command in (current project, deployment "deployName", container "containerName")');
    console.log('')
    console.log('    To change the current project, look:')
    console.log('      $ mp p set -h')
    console.log('');
  });
}
module.exports = load
