#!/usr/bin/env node

var exec = require('executive');

var Cmd = function(){
  //callback: function(err, stdout, stderr){}

  // https://www.npmjs.com/package/executive
  this.simpleExec = function(command, options = {}, callback){
    exec.quiet(command, options, callback)
  }

  //callback: function(err, stdout, stderr){}
  this.sync = function(command, callback){
    this.simpleExec(command,{sync: true}, callback)
  }

  this.async = function(command, callback){
    this.simpleExec(command, {sync: false}, callback)
  }


  this.execRemote = function(executableFile, params){
    var spawn = require('child_process').spawn;

    var child = spawn(executableFile, params, {stdio: [0, 1, 2]});
  }



}

module.exports = new Cmd()