#!/usr/bin/env node

var scope = require(__base+"utilities/scope.js")
var _description = 'Manage remote databases'
var _alias = "pg"
var _name  = "postgres"

var _options = [
  new scope.Option("d", "deployment", "Deployment name"),
  new scope.Option("c", "container", "Container name. Current repository name by default")
] 

module.exports = {
  description: _description,
  alias: _alias,
  name: _name,
  options: _options
}
