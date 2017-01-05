#!/usr/bin/env node

var jsonFile = require('jsonfile')
var cmd_ = require('./cmd.js');

var config = function(){

  var mainFolder = process.env.HOME + "/.mp"

  var paths = {
    k8s: mainFolder + "/k8s.json"
    gcloud: mainFolder + "/gcloud.json"
  }

  this.values = {
    k8s: {

    },
    gcloud: {
      projectId: "XXXX",
      clusterName: "XXXX"
    }
  }

  var cmd = new cmd_.Cmd()

  var checkConfigOrCreate = function(){
    cmd.sync("mkdir -p " + mainFolder, null)
    cmd.sync("touch " + paths.k8s, null)
    cmd.sync("touch " + paths.gcloud, null)
  }

  var read = function(filePath){
    var config = jsonFile.readFileSync(filePath)
    if (config === undefined || config === null)
      return {}
    return config
  }

  this.reload = function(fileId){
    var filePath = paths[fileId]
    this.values[fileId] = read(filePath)
  }

  this.reloadAll = function(){
    var keys = Object.keys(paths)
    for (var key in keys) {
        this.reload(key)
    }
  }

  this.save = function(fileId){
    var filePath = paths[fileId]
    jsonfile.writeFileSync(filePath, this.values[fileId])
  }

  this.saveAll = function(){
    var keys = Object.keys(paths)
    for (var key in keys) {
        this.save(key)
    }
  }

}

