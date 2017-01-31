#!/usr/bin/env node

var FileUtils = function(){

  const fs = require('fs');
  const path = require('path');
  //callback: function(err, stdout, stderr){}

  // https://www.npmjs.com/package/executive
  this.getFiles = function(srcpath){
    return fs.readdirSync(srcpath).filter(function(file) {
      return !fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  }


  this.getFolders = function (srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
      return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  }

  this.exists = function(srcpath){
    if (fs.existsSync(srcpath)) {
        return true
    }
    return false
  }
}

module.exports = new FileUtils()