#!/usr/bin/env node

var cmd = require('./cmd.js')
var prompt = require('./prompt.js')

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

  this.setProject = function(projectId,clusterId){
    cmd.sync("gcloud config set project "+projectId, function(err, stdout, stderr){
      print(err,stdout,stderr)
    })
    this.setCluster(clusterId)
  }

  this.setCluster = function(clusterId){
    var clusterName = clusterId;
    if(!clusterId){
      cmd.sync("gcloud container clusters list", function(err, stdout, stderr){
        var clusters = stdout.split("\n")
        var headers = clusters.shift()
        headers= "\t" + headers
        clusters.pop()
        console.log(headers)
        if(clusters.length > 0){
          var hash = {}
          for (var i = 0; i < clusters.length; i++) {
            
            hash[i] = clusters[i].split(" ")[0]
            clusters[i] = "("+i+")\t"+clusters[i]
            console.log(clusters[i])
          }

          
          clusterId = prompt.input("Select which cluster you will use: ")
          var toInt = parseInt(clusterId)
          if(!isNaN(toInt)){
            clusterName = hash[parseInt(clusterId)]
          }else{
            clusterName = clusterId
          }

        }else{
          console.log("Cluster not found. Try creating a new cluster")
        }

      });
    }

    cmd.sync("gcloud container clusters get-credentials "+clusterName, print)

  }
   
  this.getCurrentProject = function(){
    cmd.sync("gcloud config get-value project", function(err, stdout, stderr){
      console.log(stdout);
    })
  }

  var print = function(err, stdout, stderr){
    if(!!err)
      console.log(err);
    if(!!stdout)
      console.log(stdout);
    if(!!stderr)
      console.log(stderr);
  }
}

module.exports = new GCloud()