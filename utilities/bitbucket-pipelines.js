#!/usr/bin/env node

var cmd = require(__base+'utilities/cmd.js')
var config = require(__base+'utilities/config.js');
var prompt = require(__base+'utilities/prompt.js');
var fileUtils = require(__base+'utilities/file_utils.js');
var request = require('sync-request');

var BitbucketPipeline = function(teamId){
  var accessToken = null
  var endpoint = "https://api.bitbucket.org/2.0/"
  var Variable = function(key, uuid, value){
    this.key = key
    this.uuid = uuid
    this.value = value
  }

  var setAccessToken = function(){
    if(!!accessToken)
      return accessToken

    var bbKey = config.values.bb.key
    var bbSecret = config.values.bb.secret

    var curl = "curl https://bitbucket.org/site/oauth2/access_token \
      -d grant_type=client_credentials \
      -u "+bbKey+":"+bbSecret
    cmd.sync(curl, function(err, stdout, stderr){
      var response = JSON.parse(stdout);
      accessToken = response.access_token;
      var refreshToken =  response.refresh_token;
    })
  }


  var get = function(path){

    if(accessToken == null)
      setAccessToken()

    var url = endpoint+path
    // console.log("url")
    // console.log(url)

    // console.log("accessToken")
    // console.log(accessToken)

    var res = request('GET', url, {
      'headers': {
        'Authorization': "Bearer "+accessToken
      }
    });
    return res
  }

  var put = function(path, data){

    if(accessToken == null)
      setAccessToken()

    var url = endpoint+path
    // console.log("url")
    // console.log(url)

    // console.log("accessToken")
    // console.log(accessToken)

    var res = request('PUT', url, {
      'headers': {
        'Authorization': "Bearer "+accessToken
      },
      'json': data
    });
    return res
  }

  var post = function(path, data){

    if(accessToken == null)
      setAccessToken()

    var url = endpoint+path
    // console.log("url")
    // console.log(url)

    // console.log("accessToken")
    // console.log(accessToken)

    var res = request('POST', url, {
      'headers': {
        'Authorization': "Bearer "+accessToken
      },
      'json': data
    });
    return res
  }



  var del = function(path, data){

    if(accessToken == null)
      setAccessToken()

    var url = endpoint+path
    console.log("url")
    console.log(url)

    // console.log("accessToken")
    // console.log(accessToken)

    var res = request('DELETE', url, {
      'headers': {
        'Authorization': "Bearer "+accessToken
      }
    });
    return res
  }


  var getConfigVariable = function(url, print){
    var variables = []
    var variablesHash = {}
    var response = get(url)
    var responseTxt = response.body.toString('utf8')
    var responseJson =JSON.parse(responseTxt) 
    // console.log(responseJson)  
    if(!!responseJson.type&&responseJson.type=="error"){
      console.log("BitBucket error: "+responseJson.error.message)
    }
    else{
      var variablesJson = responseJson.values
      if(print)
        console.log("KEY\t\t\tVALUE")
      for(var i =0; i<variablesJson.length; i++){
        var variableJson = variablesJson[i]
        var variable = new Variable(variableJson.key, variableJson.uuid, variableJson.value)

        if(print)
          console.log(variable.key+":\t"+(variable.key.length<15 ? "\t" : "")+variable.value)
        variables.push(variable)
        variablesHash[variableJson.key] = variable
      }
    }
    return variablesHash
  }


  var variablesToJson = function(){

  }

  this.getTeamConfigVariables = function(print=true){
    var url = "teams/"+teamId+"/pipelines_config/variables/"
    if(print)
      console.log("Pipelines variables for team "+teamId+":")
    return getConfigVariable(url,print)


  }

  this.getRepositoryConfigVariables = function(repositoryId,print=true){
    var url = "repositories/"+teamId+"/"+repositoryId+"/pipelines_config/variables/"
    console.log("Pipelines variables for team "+teamId+", repo "+repositoryId+":")
    return getConfigVariable(url,print)

  }


  this.enablePipelinesForRepository= function(repositoryId){
    var data = {enabled: true}
    var response = put("repositories/"+teamId+"/"+repositoryId+"/pipelines_config", data)
    console.log("Pipelines enabled for "+repositoryId)
  }


  // this.enablePipelines= function(repositoryId){
  //   var data = {enabled: true}
  //   var response = put("/repositories/"+teamId+"/"+repositoryId+"/pipelines_config", data)
  //   console.log(response)
  // }



  var setConfigVariable = function(variablesHash,createUrl, variableKey, variableValue){
    var variable = variablesHash[variableKey]
    // console.log(variablesHash)
    var changed = true
    if(!variable){
      variable = new Variable(variableKey, null, variableValue)
    }else{
      if(variable.value === variableValue){
        changed = false
      }else{
        changed = true
      }
      variable.key    = variableKey
      variable.value  = variableValue
    }

    if(!changed){
      console.log("Variable '"+variableKey+"' not changed")
      return
    }

    var data = {}
    data.key = variable.key
    data.value = variable.value
    data.secured = false
    if(!!variable.uuid)
      data.uuid = variable.uuid

    var response = null

    if(!!variable.uuid){
      var updateUrl = createUrl+variable.uuid
      response = put(updateUrl, data)
    }else{
      response = post(createUrl, data)
    }
    response = response.body.toString('utf8')
    console.log("Variable '"+variable.key+"' updated to '"+variable.value+"'")
    // console.log(response)
  }


   var unsetConfigVariable = function(variablesHash,createUrl,variableKey){
    var variable = variablesHash[variableKey]
    // console.log(variablesHash)
    var changed = true
    if(!variable){
      console.log("'"+variableKey+"' does not exist")
      return
    }


    var data = {}

    var deleteUrl = createUrl+variable.uuid
    response = del(deleteUrl, data)

    response = response.body.toString('utf8')
    console.log("Variable '"+variable.key+"' deleted")
  }


  this.setRepositoryConfigVariable = function(repositoryId, variableKey,variableValue, cachedVariablesHash=null){

    var variablesHash = null
    if(!!cachedVariablesHash){
      variablesHash = cachedVariablesHash
    }else{
      variablesHash = this.getRepositoryConfigVariables(repositoryId,false);
    }

    var createUrl = "repositories/"+teamId+"/"+repositoryId+"/pipelines_config/variables/"
    setConfigVariable(variablesHash,createUrl, variableKey, variableValue)    
  }


  this.setTeamConfigVariable = function(variableKey, cachedVariablesHash=null){

    var variablesHash = null
    if(!!cachedVariablesHash){
      variablesHash = cachedVariablesHash
    }else{
      variablesHash = this.getTeamConfigVariables(false);
    }

    var createUrl = "teams/"+teamId+"/pipelines_config/variables/"
    setConfigVariable(variablesHash,createUrl, variableKey, variableValue)    
  }


  this.unsetRepositoryConfigVariable = function(repositoryId, variableKey, cachedVariablesHash=null){

    var variablesHash = null
    if(!!cachedVariablesHash){
      variablesHash = cachedVariablesHash
    }else{
      variablesHash = this.getRepositoryConfigVariables(repositoryId,false);
     
    }

    var createUrl = "repositories/"+teamId+"/"+repositoryId+"/pipelines_config/variables/"
    unsetConfigVariable(variablesHash,createUrl, variableKey)    
  }


  this.unsetTeamConfigVariable = function(variableKey, cachedVariablesHash=null){

    var variablesHash = null
    if(!!cachedVariablesHash){
      variablesHash = cachedVariablesHash
    }else{
      variablesHash = this.getTeamConfigVariables(false);
    }

    var createUrl = "teams/"+teamId+"/pipelines_config/variables/"
    unsetConfigVariable(variablesHash,createUrl,variableKey)    
  }

}

module.exports = BitbucketPipeline