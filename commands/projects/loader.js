#!/usr/bin/env node

var SubModule = require('../../utilities/sub_module.js')
var sm_load = require('../../utilities/sub_module_loader.js')

var load = function(program){

  var subModule = new SubModule("projects", 'Manage gcloud projects', "p")

  subModule
    .add("list", "List all projects", function(){
      var list = require("./list.js");
      list()
    })
    .add("current", "Get current project id", function(){
      var current = require("./current.js");
      current()
    })
    .add("set", " <PROJECT ID> Set current project", function(projectId){
      var set = require("./set.js");
      set(projectId)
    })
  
  sm_load(program, subModule)
}

module.exports = load