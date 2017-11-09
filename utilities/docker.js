#!/usr/bin/env node

var cmd = require('./cmd.js')

var Docker = function(){

  this.listPodNames = function(){
   
  }

  this.getPodNames = function(containerName){
    var podNames = [];
    
    cmd.sync('docker ps -f "name=web" --format "{{.Names}}"', function(err, stdout, stderr, status){
      podNames = stdout.trim().split("\n");
    })

    return podNames
  }
}

module.exports = new Docker()