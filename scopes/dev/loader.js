#!/usr/bin/env node


var scope = require(__base+"utilities/scope.js")
var _description = 'Manage local containers'
var _alias = "dev"
var _name = "development"

var _options = [
  new scope.Option("c", "container", "Container name. Current repository name by default")
] 

module.exports = {
  description: _description,
  alias: _alias,
  name: _name,
  options: _options
}