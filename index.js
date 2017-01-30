#!/usr/bin/env node

//requires
var scopeLoader = require("./utilities/scope_loader.js")
var fileUtils = require('./utilities/file_utils.js');

//Array diff
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};
global.__base = __dirname + '/';

// // Main program
// program
//   .version('0.0.1')
//   .option('-b, --base <base>', 'Use a specific base project. (https://bitbucket.org/rails5docker/dev)', 'https://bitbucket.org/rails5docker/dev')
//   .option('-r, --remote <remote>', 'Use a specific remote. (origin)', 'origin')
//   .option('-p, --project <project>', 'Use a specific project. (default-project)', 'default-project')



var scopeFolders = fileUtils.getFolders("./scopes")


var commandFolderHash = {}

for(var i =0; i<scopeFolders.length; i++){
  var scopeFolder = scopeFolders[i];
  if (scopeFolder !== "generic"){
    var scope_ = scopeLoader.getScope("./scopes",scopeFolder)
    commandFolderHash[scope_.name]  = {folder: scopeFolder, scope: scope_}
    commandFolderHash[scope_.alias] = {folder: scopeFolder, scope: scope_}
  }
}


var filteredArgs = function(scope){
  var ret = process.argv.diff([scope.name, scope.alias])
  return ret;
}

var getScope = function(){


  var scopeCommand = "generic";
  var scopeFolder = "generic";
  var scope_ = scopeLoader.getScope("./scopes","generic")

  if(!!commandFolderHash[process.argv[2]]){

    scopeCommand = process.argv[2]
    scopeFolder = commandFolderHash[scopeCommand].folder;
    scope_ = commandFolderHash[scopeCommand].scope;
  }
  
  return {scope: scope_, command: scopeCommand, folder: scopeFolder};
  
  
}


// console.log("process.argv")
// console.log(process.argv)


var data = getScope(process.argv)

// console.log("data.scope")
// console.log(data.scope)
// console.log(data.command)
// console.log(data.folder)

var args = filteredArgs(data.scope)

var program = scopeLoader.getProgram(data.folder)
// console.log(program)

program.parse(args);

// program.parse(process.argv);

// var program = scopeLoader.getProgram



// load(program)

// // console.log("process.argv")
// // console.log(process.argv)



// for(var i = 0; i <)


// program.parse(process.argv);

