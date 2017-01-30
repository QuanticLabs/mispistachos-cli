
var gcloud = require('../../utilities/gcloud.js')

var run = function(projectId){
  gcloud.setProject(projectId);
}

var load= function(program){
  program
  .command('set <projecIid>')
  .description('Set current project')
  .action(function(projectId){
    run(projectId)
  })
}


module.exports = load