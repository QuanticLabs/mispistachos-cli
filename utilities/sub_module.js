#!/usr/bin/env node
var get = require('get-parameter-names')

var SubModule = function(name, generalHelp,actionNames, actionHelps, actionFunctions){

  this.name = name
  this.generalHelp = generalHelp
  
  actionNames=actionNames||[]
  actionHelps=actionHelps||[]
  actionFunctions=actionFunctions||[]
  var Action = function(name, help, func){
    this.name = name;
    this.help = help;
    this.func = func;
    this.funcParams = get(func) || []

  }

  var helpCommand = function (){
    return "mp "+name+" -h"
  }

  // console.log(actionNames)
  // console.log(actionHelps)
  // console.log(actionFunctions)
  if(!(actionNames.length === actionHelps.length && actionHelps.length === actionFunctions.length)){
    console.log('Subcommand definition error: Init variables length doesn\'t match') 
    process.exit()
  }

  this.actions = []
  this.actionsHash = {}

  for(var i = 0; i < actionNames.length; i++){
    this.add(actionNames[i], actionHelps[i], actionFunctions[i])
  }


  this.help = function(){
    var text = ""

    for(var i = 0; i< this.actions.length; i++){
      var action = this.actions[i];
      var t = action.name+", "+action.help;
      text = text + "\n    "+t;
    }
    console.log(text);
  }



  //acepta más parametros
  this.exec = function(actionName){
    var action = this.actionsHash[actionName];

    var args = Object.values(arguments).slice(1)

    if(action === undefined || action === null){
      console.log('Subcommand definition error: Action "'+actionName+'" doesn\'t exist. Try running ' + helpCommand()) 
      process.exit()
    }

    if(action.funcParams.length < args.length){
      console.log('Arguments doesn\'t match: Try running ' + helpCommand()) 
      process.exit()
    }

    action.func.apply(action, args)
  }

  this.add = function(actionName, actionHelp, actionFunction){
    var action = new Action(actionName, actionHelp, actionFunction);
    this.actions.push(action);
    this.actionsHash[actionName] = action;
    return this
  }

  this.length = function(){
    return this.actionNames.length
  }

}


module.exports = SubModule