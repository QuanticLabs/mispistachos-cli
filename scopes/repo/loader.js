#!/usr/bin/env node

var scope = require(__base+"utilities/scope.js")

var _description = 'Manage projects in local and bitbucket repository'
var _alias = "r"
var _name = "remote"


var _options = [
  new scope.Option("t", "team", "Project team id (must exist)"),
  new scope.Option("r", "repository", "Repository name (must exist)")
] 

module.exports = {
  description: _description,
  alias: _alias,
  name: _name,
  options: _options
}