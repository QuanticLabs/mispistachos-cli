#!/usr/bin/env node

var promptSync = require('prompt-sync')()


var prompt = function(){

  
  this.input = function(message){
    var ans = promptSync(message, null)
    return ans
  }

  this.password = function(message){

    var pass = promptSync.hide(message, null)
    return pass
  }

  this.confirm = function(message){
    var answer = promptSync(message, "")
    if(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes")
      return true
    else
      return false
  }

}

module.exports = {
  Prompt: prompt
}
