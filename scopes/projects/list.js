
var gcloud = require('../../utilities/gcloud.js')

var run = function(){
  gcloud.listProjects();
}

var load= function(program){
  program
  .command('list')
  .description('List all projects')
  .action(function(options){
    run()
  })
}
module.exports = load
