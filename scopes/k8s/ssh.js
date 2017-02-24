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
}
module.exports = load
