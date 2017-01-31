#!/usr/bin/env node

var cmd = require('./cmd.js')

var K8S = function(id, name, number){
  this.id = id;
  this.name = name;
  this.number = number
}

var GCloud = function(){
  this.listProjects = function(){
    cmd.sync("gcloud projects list", function(err, stdout, stderr){
      console.log(stdout)
    })
  }
}

module.exports = new GCloud()