var utils = require('./utils.js')
var k8s = require(__base+'utilities/k8s.js')
var cmd = require(__base+'utilities/cmd.js')

var run = function(userContainerFlagValue, userDeploymentFlagValue){
  var containerName = utils.getContainer(userContainerFlagValue)
  var deploymentName = utils.getDeployment(userDeploymentFlagValue)


  console.log("Searching pod for container '"+containerName+"'")

  var podNames = k8s.getPodNames(containerName, deploymentName)
  
  if(podNames.length == 0){
    console.log("Pod not found")
    process.exit()
  }

  var podName = null



  if(podNames.length == 1){
    podName = podNames[0]
  }else{
    var webPodNames = podNames.filter(function(p){ return p.includes("web-")})
    if(webPodNames.length > 0){
      podName = webPodNames[0]
    }else{
      podName = podNames[0]
    }
  }

  if(!podName){
    console.log("Pod not found")
    process.exit()
  }

  console.log("Pod '"+podName+"' found") 

  var fullCommand = "kubectl exec -it "+podName+" -c "+containerName+" bash"
  console.log("Executing command:")
  console.log("  " + fullCommand)
  console.log("")
  console.log("")

  var spawn = require('child_process').spawn;
  var child = spawn('kubectl', ['exec', '-it', podName, '-c', containerName, 'bash'], {stdio: [0, 1, 2]});

  // child.stdout.on('data', function(chunk) {
  //   console.log(chunk)
  // });

  // or if you want to send output elsewhere
  // child.stdout.pipe(dest);
  // child.stdout.pipe(process.stdout);
  // child.stderr.pipe(process.stderr);


}

var load= function(program){
  program
  .command('ssh')
  .alias('bash')
  .description('SSH to a specific container')
  .action(function(){
    run(program.container, program.deployment)
  })
  .on('--help', function(){
    console.log("    Check 'mp k -h' for global options")
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ mp k ssh                                       # SSH with container "repoName" in the current project');
    console.log('    $ mp k ssh -d deployName                         # SSH with container "repoName", deployment "deployName" in the current project');
    console.log('    $ mp k ssh -c containerName                      # SSH with container "containerName" in the current project');
    console.log('    $ mp k ssh -d deployName -c containerName        # SSH with container "containerName", deployment "deployName" in the current project, container "containerName" in the current project');
    console.log('')
    console.log('    To change the current project, look:')
    console.log('      $ mp p set -h')
    console.log('');
  });
}
module.exports = load
