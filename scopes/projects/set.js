
var gcloud = require('../../utilities/gcloud.js')

var run = function(projectId, clusterId, zone){
  gcloud.setProject(projectId);
  gcloud.setCluster(clusterId, zone)
}

var load= function(program){
  program
  .command('set [PROJECT_ID] [CLUSTER_ID]')
  .description('Set the default project and cluster')
  .action(function(projectId,clusterId){
    var zone = program.zone;
    run(projectId, clusterId, zone)
  })
}


module.exports = load