
var gcloud = require('../../utilities/gcloud.js')

var run = function(projectId, clusterId){
  gcloud.setProject(projectId, clusterId);
}

var load= function(program){
  program
  .command('set <PROJECT_ID> [CLUSTER_ID]')
  .description('Set the default project')
  .action(function(projectId,clusterId){
    run(projectId,clusterId)
  })
}


module.exports = load