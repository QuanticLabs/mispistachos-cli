#!/usr/bin/env node

var _description = 'Manage gcloud projects'
var _alias = "p"
var _name = "projects"


var Option = function(alias,name,description){
  this.alias = alias
  this.name = name
  this.description = description
}

var _options = [
  new Option("-z", "zone", "GCP project zone")
] 

module.exports = {
  description: _description,
  alias: _alias,
  name: _name,
  options: _options
}