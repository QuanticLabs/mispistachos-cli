#!/usr/bin/env node

var SubModule = require('../utilities/sub_module.js')
var sm_load = require('../utilities/sub_module_loader.js')
var fs = require('fs');
var path = require('path');

var load = function(program){

  program
  .command('init')
  .description('Run interactive setup commands.')
  .action(function(options){
    var init = require("./init.js");
    init(program.remote)
  })

  loadSubModules(program);

}

var loadSubModules = function (program){
  var directories = getDirectories("./commands");
  for(var i = 0; i<directories.length;i++){
    var directory = directories[i];
    var loaderPath = "./"+directory+"/loader.js"
    var load = require(loaderPath);
    load(program)
  }
}

var getDirectories = function (srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

module.exports = load