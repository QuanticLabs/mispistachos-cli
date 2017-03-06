

var userUtils = require(__base+'utilities/user.js')
var k8s = require(__base+'utilities/k8s.js')
var cmd = require(__base+'utilities/cmd.js')

var run = function(userContainerFlagValue, userDeploymentFlagValue){
  var containerName = userUtils.getContainer(userContainerFlagValue)
  var deploymentName = userUtils.getDeployment(userDeploymentFlagValue)


  console.log("Searching pod for container '"+containerName+"'")

  var podName = userUtils.getPod(containerName, deploymentName)

  var fullCommand = "kubectl exec -it "+podName+" -c "+containerName+" -- tail -f log/production.log"
  console.log("Executing command:")
  console.log("  " + fullCommand)
  console.log("")
  console.log("")

  var params = ['exec', '-it', podName, '-c', containerName, '--', 'tail', '-f', 'log/production.log']
  cmd.execRemote('kubectl', params)
}

var load= function(program){
  program
  .command('logs')
  .alias('log')
  .description('Check logs for container')
  .action(function(){
    run(program.container, program.deployment)
  })
  .on('--help', function(){
    console.log("    Check 'mp k -h' for global options")
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ mp k logs                                       # SSH with container "repoName" in the current project');
    console.log('')
    console.log('    To change the current project, look:')
    console.log('      $ mp p set -h')
    console.log('');
  });
}
module.exports = load
