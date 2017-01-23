#!/usr/bin/env node

var SubModule = require('../../utilities/sub_module.js')
var sm_load = require('../../utilities/sub_module_loader.js')

var load = function(program){

  var subModule = new SubModule("project", 'Manage gcloud projects')

  subModule
    .add("list", "List all projects", function(){
      var list = require("./list.js");
      list()
    })
  
  sm_load(program, subModule)
}

module.exports = load