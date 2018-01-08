#!/usr/bin/env node


var scope = require(__base+"utilities/scope.js")
var _description = 'Manage kubernetes containers'
var _alias = "k"
var _name = "k8s"

var _options = [
  new scope.Option("d", "deployment", "Deployment name"),
  new scope.Option("c", "container", "Container name. Current repository name by default"),
  new scope.Option("n", "namespace", "Namespace name. 'default' by default")
] 

module.exports = {
  description: _description,
  alias: _alias,
  name: _name,
  options: _options
}