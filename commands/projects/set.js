
var gcloud = require('../../utilities/gcloud.js')

var run = function(projectId){
  gcloud.setProject(projectId);
}

module.exports = run