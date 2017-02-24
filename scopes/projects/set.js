
var gcloud = require(__base+'utilities/gcloud.js')

var run = function(projectId, clusterId, zone){
  gcloud.setProject(projectId);
  gcloud.setCluster(clusterId, zone)
}

var load= function(program){
  program
  .command('set [PROJECT_ID] [CLUSTER_ID]')
  .description('Set the default Google Cloud project and cluster')
  .action(function(projectId,clusterId){
    var zone = program.zone;
    run(projectId, clusterId, zone)
  })
  .on('--help', function(){
    console.log("    Check 'mp p -h' for global options")
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ mp p set                         # Show a list with all available projects and ask which project and cluster to choose');
    console.log('    $ mp p set projectId               # Set "projectId" as the default project and ask which cluster to choose');
    console.log('    $ mp p set projectId clusterId     # Set "projectId" as the default project and "clusterId" as the default cluster');
    console.log('');
  });
}


module.exports = load