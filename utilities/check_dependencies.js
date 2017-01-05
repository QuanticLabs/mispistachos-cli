#!/usr/bin/env node
var exec = require('executive');
var cmd_ = require('./cmd.js');
var sleep = require('sleep');

var check = function (sem) {
  var self = this;
  var cmd = new cmd_.Cmd()

  self.git = function () {
    cmd.sync('git --version', function(err, stdout, stderr) {
      if(err!=null){
        console.log('Error: \'git\' not found')
        process.exit()
      }
      else{
        console.log('\'git\' found')
      }

    })
  }

  self.docker = function () {
    cmd.sync('docker -v', function(err, stdout, stderr) {
      if(err!=null){
        console.log('Error: \'docker\' not found')
        process.exit()
      }
      else{
        console.log("\'docker\' found")
      }
    })

  }

  self.dockerCompose = function () {
    cmd.sync('docker-compose -v', function(err, stdout, stderr) {
      if(err!=null){
        console.log('Error: \'docker-compose\' not found')
        process.exit()
      }
      else{
        console.log("\'docker-compose\' found")
      }
    })
  }

}

module.exports = check;
