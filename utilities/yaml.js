#!/usr/bin/env node

var YAML = require('yamljs');
var writeFile = require('write');

var Yaml = function(filePath){

  this.filePath = filePath
  this.values = {}
  
  this.load = function(){
    this.values = YAML.load(this.filePath)
    return this.values
  }

  this.print = function(){
    var keys = Object.keys(this.values)

    for(var i = 0 ; i< keys.length ; i++){
      var key = keys[i]
      console.log(key+":\t"+this.values[key])
    }
  }
  this.save = function(){
    var success = true
    var yamlString= YAML.stringify(nativeObject, 4);
    writeFile.sync(this.filePath, yamlString, function(err) {
      console.log(err)
      success = false
    });
    return success
  }

}

module.exports = Yaml;
