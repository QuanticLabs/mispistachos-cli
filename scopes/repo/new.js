var bitbucket = require(__base+'utilities/bitbucket.js')
var cmd = require(__base+'utilities/cmd.js')
var prompt = require(__base+'utilities/prompt.js')
var config = require(__base+'utilities/config.js')

var run = function(projectName, teamId){
  
  var userPath = process.cwd()

  if(!teamId){
      console.log("Enter the id of the bitbucket team that will work on the project.\n\
If you have not created it yet, you can do here:\n\
\thttps://bitbucket.org/account/create-team/?team_source=header")
      teamId = prompt.input("Team ID: ")
    }


  if(!teamId || teamId.length === 0){
    console.log("Team name empty")
    process.exit()
  }

  if(!bitbucket.touchTeam(teamId)){
    console.log("Team doesn't exists")  
    process.exit()
   }else{
    console.log("Team fetched from bitbucket")  
   }

  if (bitbucket.cloneDefaultInit(userPath, projectName)){
    var projectPath = userPath + "/" + projectName
    bitbucket.addRemote(projectPath, "defaultinit", config.values.cli.defaultInit)

    // var repositoryName = projectName.replace(/\W/g, '').toLowerCase()
    var repositoryName = "dev"
    if(bitbucket.createRemoteRepository(teamId, repositoryName)){
      bitbucket.addRemote(projectPath, "origin", "git@bitbucket.org:"+teamId+"/"+repositoryName+".git")

    }
  }

}

var load= function(program){
  program
  .command('new <PROJECT_NAME>')
  .description('Clone default init, push to a new bitbucket repository and add them to origin')
  .action(function(projectName){
    run(projectName)
  })
}

module.exports = load