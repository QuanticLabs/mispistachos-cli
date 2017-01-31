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
    var projectsHash = {}
    cmd.sync("gcloud projects list", function(err, stdout, stderr){
      var projects = stdout.split("\n")
      var headers = projects.shift()
      headers= "\t" + headers
      projects.pop()
      console.log(headers)

      if(projects.length > 0){
        for (var i = 0; i < projects.length; i++) {
          projectsHash[i] = projects[i].split(" ").diff([""])[0]
          projects[i] = "("+i+")\t"+projects[i]
          console.log(projects[i])
        }

      }else{
        console.log("Projects not found. Try creating a new project")
      }

    });
    return projectsHash
  }

  this.setProject = function(projectId){
    var projectName = projectId;
    if(!projectId){
      var projectsHash = this.listProjects()
      projectId = prompt.input("Select in which project you will work: ")

      var toInt = parseInt(projectId)
      if(!isNaN(toInt)){
        projectName = projectsHash[parseInt(projectId)]
      }else{
        projectName = projectId
      }
    }

    if(!!projectName){
      cmd.sync("gcloud config set project "+projectName, print)  
    }
    
  }


  this.listClusters = function(){
    var clustersHash = {}
    cmd.sync("gcloud container clusters list", function(err, stdout, stderr){
        var clusters = stdout.split("\n")
        var headers = clusters.shift()
        headers= "\t" + headers
        clusters.pop()
        console.log(headers)

        if(clusters.length > 0){
          for (var i = 0; i < clusters.length; i++) {
            var splitted = clusters[i].split(" ").diff([""])
            clustersHash[i] = {name: splitted[0], zone: splitted[1]}
            clustersHash[splitted[0]] = {name: splitted[0], zone: splitted[1]}
            clusters[i] = "("+i+")\t"+clusters[i]
            console.log(clusters[i])
          }



        }else{
          console.log("Cluster not found. Try creating a new cluster")
        }

    });
    return clustersHash
  }

  this.setCluster = function(clusterId, clusterZone){
    var clusterName = clusterId;
    if(!clusterId){

      var clustersHash = this.listClusters()
      clusterId = prompt.input("Select which cluster you will use: ")
      var toInt = parseInt(clusterId)
      if(!isNaN(toInt)){
        clusterName = clustersHash[toInt].name
        clusterZone = clustersHash[toInt].zone
      }else{
        clusterName = clustersHash[clusterId].name
        clusterZone = clustersHash[clusterId].zone
      }
    }


      if(!!clusterZone){
        cmd.sync("gcloud container clusters get-credentials "+clusterName+" --zone="+clusterZone, print)
      }else{
        cmd.sync("gcloud container clusters get-credentials "+clusterName, print)
      }
  }
   
  this.getCurrentProject = function(){
    cmd.sync("gcloud config get-value project", print)
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