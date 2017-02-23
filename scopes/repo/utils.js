
var Bitbucket = require(__base+'utilities/bitbucket.js')
var bitbucket = new Bitbucket(process.cwd())


var Utils = function(){

  this.getTeam = function(userTeamFlagValue){
    var teamName = bitbucket.teamName
    if(!!userTeamFlagValue && userTeamFlagValue !== true){
      teamName = userTeamFlagValue
    }

    return teamName
  }

  this.getRepo = function(userTeamFlagValue, userRepoFlagValue){
    var repoName = bitbucket.repositoryName

    if       (!!userTeamFlagValue === true && !!userRepoFlagValue === false){
      repoName = null
    }else if (!!userRepoFlagValue === true && userRepoFlagValue !== true){
      repoName = userRepoFlagValue
    }
    return repoName
  }

}



module.exports = new Utils();