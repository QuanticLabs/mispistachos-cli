#!/usr/bin/env node

var jsonFile = require('jsonfile')
var cmd = require('./cmd.js');

var Config = function(){

  var mainFolder = process.env.HOME + "/.mp"

  var paths = {
    cli: mainFolder + "/cli.json",
    bb: mainFolder + "/bb.json",
    k8s: mainFolder + "/k8s.json",
    gcloud: mainFolder + "/gcloud.json"
  }

  this.values = {
    k8s: {

    },
    bb: {
      key: "",
      secret: ""
    },
    cli: {
      password: null,
      defaultInit: "git@bitbucket.org:rails5docker/dev.git"
    },
    gcloud: {
      projectId: "XXXX",
      clusterName: "XXXX"
    }
  }

  this.checkConfigOrCreate = function(){
    cmd.sync("mkdir -p " + mainFolder, null)

    var keys = Object.keys(paths)
    for (var i = 0; i< keys.length; i++) {
      var key = keys[i]
      cmd.sync("touch " + paths[key], null)
    }
    // cmd.sync("touch " + paths.k8s, null)
    // cmd.sync("touch " + paths.cli, null)
    // cmd.sync("touch " + paths.gcloud, null)
  }

  var read = function(filePath){

    var config = {}

    try{
      config = jsonFile.readFileSync(filePath)
    }catch(err){
      config = {}
    }
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
    for (var i = 0; i< keys.length; i++) {
      var key = keys[i]
      this.reload(key)
    }
  }

  this.save = function(fileId){
    var filePath = paths[fileId]
    jsonFile.writeFileSync(filePath, this.values[fileId])
  }

  this.saveAll = function(){
    var keys = Object.keys(paths)

    for (var i = 0; i< keys.length; i++) {
      var key = keys[i]

      this.save(key)
    }
  }

}
var config = new Config()
config.checkConfigOrCreate()
config.reloadAll()
module.exports = config 
