#!/usr/bin/env node

var cmd = require('./cmd.js')

var project = function(id, name, number){
  this.id = id;
  this.name = name;
  this.number = number
}

var GCloud = function(){
  this.listProjects = function(){
    cmd.sync("gcloud projects list", function(err, stdout, stderr){
      console.log(stdout);
    })
  }

  this.setProject = function(projectId){
    cmd.sync("gcloud config set project "+projectId, function(err, stdout, stderr){
      console.log(stdout);
    })
  }

   
  this.getCurrentProject = function(){
    cmd.sync("gcloud config get-value project", function(err, stdout, stderr){
      console.log(stdout);
    })
  }
}

module.exports = new GCloud()