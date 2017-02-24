
var gcloud = require(__base+'utilities/gcloud.js')

var run = function(){
  gcloud.getCurrentProject();
}

var load= function(subProgram){
  subProgram
  .command('current')
  .description('Get current project id')
  .action(function(options){
    run()
  })
}

module.exports = load