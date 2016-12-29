#!/usr/bin/env node
var exec = require('executive');

var check = function (sem) {
  var self = this;

  self.git = function () {
    exec.quiet('git --version', function(err, stdout, stderr) {
      if(err!=null){
        console.log('Error: git not found')
      }
      else{
        sem.leave([1])
      }
    })
  }

  self.docker = function () {
    exec.quiet('docker -v', function(err, stdout, stderr) {
      if(err!=null){
        console.log('Error: docker not found')
      }
      else{
        sem.leave([1])
      }
    })
  }

  self.dockerCompose = function () {
    exec.quiet('docker-compose -v', function(err, stdout, stderr) {
      if(err!=null){
        console.log('Error: docker-compose not found')
      }
      else{
        sem.leave([1])
      }
    })
  }

}

module.exports = check;
