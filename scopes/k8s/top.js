
var cmd = require(__base+'utilities/cmd.js')

var run = function(resource, namespace){

  //kubectl port-forward -n kube-system monitoring-grafana-3552275057-0splp 3010:3000

  


  var fullCommand;
  var params;
  
  
  if(resource === "node" || resource === "nodes"){
    fullCommand = "kubectl node";
    params = ["top", "node"];

  }else if(resource === "pod" || resource === "pods"){
    if(!namespace)
      namespace = "default"

    
    if(namespace === "all"){
      fullCommand = "kubectl top pods --all-namespaces --containers";
      params = ["top", "pods", "--all-namespaces", "--containers"];
    }else{
      fullCommand = "kubectl top pods -n "+namespace+" --containers";
      params = ["top", "pods", "-n", namespace, "--containers"];
    }
    
  }else{
    console.log("The resource '"+resource+"' is not valid. Check 'mp k top -h'")
    process.exit();
  }

  console.log("Executing command:")
  console.log("  " + fullCommand)
  console.log("")
  console.log("")

  cmd.execRemote('kubectl', params)

}

var load= function(program){
  program
  .command('top [RESOURCE] [NAMESPACE]')
  .description('Check the current RAM and CPU usage for the specified RESOURCE')
  .action(function(resource, namespace){
    run(resource, namespace)
  })
  .on('--help', function(){
    console.log("    Check 'mp k -h' for global options")
    console.log('');
    console.log('    RESOURCE: Valid values are \'top\' or \'node\'');
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ mp k top node                    # Show CPU and RAM usage for virtual machines');
    console.log('    $ mp k top pods                    # Show CPU and RAM usage for all pods');
    console.log('');
  });
}


module.exports = load