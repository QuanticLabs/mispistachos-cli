#!/usr/bin/env node

var exec = require('executive');

var Cmd = function(){
  //callback: function(err, stdout, stderr){}

  // https://www.npmjs.com/package/executive
  this.exec = function(command, options = {}, callback){
    exec.quiet(command, options, callback)
  }

  //callback: function(err, stdout, stderr){}
  this.sync = function(command, callback){
    this.exec(command,{sync: true}, callback)
  }

  this.async = function(command, callback){
    this.exec(command, {sync: false}, callback)
  }
}

module.exports = new Cmd()