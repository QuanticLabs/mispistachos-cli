#!/usr/bin/env node

var fileUtils = require('./file_utils.js');
var program = require('commander');



var filteredArgs = function(subModule){
  var ret = process.argv.diff([subModule.name, subModule.alias])
  return ret;
}


var _getProgram = function(scopeFolder){

  var folderPath = __base+"scopes/"+scopeFolder
  var scope = require(__base+"scopes/"+scopeFolder+"/loader.js");
  var subProgram = new program.Command();
  
  subProgram
    .description(scope.description)
    .version('0.0.1')

  for (var i = 0; i < scope.options.length; i++){
    var option = scope.options[i]
    subProgram
      .option("-"+option.alias+", --"+ option.name+" ["+option.name+"]", option.description)
  }

  var files = fileUtils.getFiles(folderPath)
  for (var i = 0; i < files.length; i++){
    var fileName = files[i]
    if(fileName !== "loader.js"){
      var load = require(folderPath+"/"+fileName)
      load(subProgram)
    }
  }


  if(scopeFolder === "generic"){
    var folders = fileUtils.getFolders(__base+"scopes")
    for (var i = 0; i < folders.length; i++){
      var folder = folders[i]
      if(folder !== "generic"){
        var scope = require(__base+"scopes/"+folder+"/loader.js");

        subProgram
          .command(scope.name, {noHelp: false})
          .alias(scope.alias)
          .description(scope.description)
          .action(function(){})
      }

    }
    
  }

  return subProgram
}

var _getScope = function(pathToScopes,scopeFolder){
  var scope = require("../scopes/"+scopeFolder+"/loader.js")
  return scope
}


var _loadHeaderToProgram = function(scopeFolderPath, program){

  var scope = require(scopeFolderPath+"/loader.js");

  program
    .command(scope.name, {noHelp: false})
    .alias(scope.alias)
    .description(scope.description)
    .action(function(){
      console.log(scope.name+" command")
    })

}

module.exports = {
  load: _loadHeaderToProgram,
  getProgram: _getProgram,
  getScope: _getScope

}