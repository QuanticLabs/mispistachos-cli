#!/usr/bin/env node

var cmd = require('./cmd.js')

var K8S = function(){

  this.listPodNames = function(){
    var pods = []
    cmd.sync("kubectl get pods | awk '{print $1}'", function(err, stdout, stderr){
      pods = stdout.split("\n")
      pods.shift()
    })
    return pods
  }

  this.getPodNames = function(containerName, deploymentName, namespace){
    if (!namespace)
      namespace = "default"

    var podNames = []
    var fullCommand = "kubectl get pods -n "+namespace+" --output=jsonpath={.items..metadata.name}"
    // var fullCommand = "kubectl get pods -o=jsonpath='{range .items[*]}{\"\\n\"}{.metadata.name}{\":\\t\"}{range .spec.containers[*]}{.image}{\", \"}{end}{end}' | sort"
    
    console.log("Executing:")
    console.log("  "+fullCommand)
    cmd.sync(fullCommand, function(err, stdout, stderr){
      // console.log(`err: ${err} stdout: ${stdout} stderr: ${stderr}`)
      
      var lines = stdout.split(" ")
      console.log('Pods Found: ')
      console.log(lines)
      if(!!deploymentName){
        lines = lines.filter(function(l){ return l.includes(containerName+"")&&l.includes(deploymentName+"-") })

      }else{
        lines = lines.filter(function(l){ return l.includes(containerName+"")})
      }
      
      podNames = lines.map(function(l){ return l.split(":")[0]})
    })
    return podNames
  }
}

module.exports = new K8S()