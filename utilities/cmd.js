#!/usr/bin/env node

var exec = require('executive');

var cmd = function(){
  // https://www.npmjs.com/package/executive
  this.exec = function(command, options = {}, callback){
    exec.quiet(command, options, callback)
  }

  this.sync = function(command, callback){
    this.exec(command,{sync: true}, callback)
  }

  this.async = function(command, callback){
    this.exec(command, {sync: false}, callback)
  }
}

module.exports = {
  Cmd: cmd
}
