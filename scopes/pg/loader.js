#!/usr/bin/env node

var scope = require(__base+"utilities/scope.js")
var _description = 'Manage remote databases'
var _alias = "pg"
var _name  = "postgres"

var _options = [
  new scope.Option("s", "skipBackup", "Do not make a new backup and use the last one."),
  new scope.Option("n", "namespace", "Namespace name. 'default' by default")
] 

module.exports = {
  description: _description,
  alias: _alias,
  name: _name,
  options: _options
}
