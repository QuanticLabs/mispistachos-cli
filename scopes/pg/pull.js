var k8s = require(__base+'utilities/k8s.js')
var cmd = require(__base+'utilities/cmd.js')
var userUtils = require(__base+'utilities/user.js')


var checkIfContainerRunning = function(containerName){
  var command = "docker ps | grep '"+containerName+"'" 
  var ret = false;
  cmd.sync(command, function(err,stdout,stderr){
    // console.log(stdout)
    var runningContainers = stdout.split("\n").length - 1
    console.log("Running containers: "+runningContainers)
    if(runningContainers > 0){
      ret = true;
    }

  });

  return ret
}

var run = function(){
  var pgContainerName = userUtils.getContainer("postgres")
  var webContainerName = userUtils.getContainer("web")
  var deploymentName = userUtils.getDeployment(null)


  console.log("Checking if postgres container is running...")
  if(checkIfContainerRunning(pgContainerName)){
      console.log("Done!")
  }else{
    console.log("Error: your postgres container must be running")
    process.exit();
  }

  console.log("");

  console.log("Checking if web is stopped stopped...")
  if(checkIfContainerRunning("web")){
      console.log("Error: you must stop web container")
      process.exit();
  }else{
      console.log("Done!")
  }

  console.log("");

  console.log("Checking if sidekiq is stopped stopped...")
  if(checkIfContainerRunning("sidekiq")){
      console.log("Error: you must stop sidekiq container")
      process.exit();
  }else{
      console.log("Done!")
  }
  console.log("");


  console.log("Searching pod for container '"+pgContainerName+"'")

  var podName = userUtils.getPod(pgContainerName, deploymentName)

  var remoteDumpAndBackupCommand = "kubectl exec -it "+podName+" -c "+pgContainerName+" sh dump_db_and_backup.sh"
  console.log("Executing command:")
  console.log("  " + remoteDumpAndBackupCommand)
  console.log("")
  console.log("")

  backupDone = true;
  cmd.sync(remoteDumpAndBackupCommand, function(err, stdout, stderr){
    console.log(stdout);
    if(stdout.indexOf("error has occurred.") > -1){
      backupDone = false;
    }
  })

  if(backupDone === false){
    console.log("Error creating database backup ");
    process.exit();
  }
  console.log("Database backup ready");
  console.log("");

  console.log("Creating an empty development database");
  var createAnEmptyDatabase = "docker-compose run --rm "+webContainerName+" bundle exec rake db:drop db:create"
  console.log("Executing command:")
  console.log("  " + createAnEmptyDatabase)
  var databaseCreated = true;
  cmd.sync(createAnEmptyDatabase, function(err,stdout,stderr){
    console.log(stdout);
    console.log(stderr);
  });


}

var load = function(program){
  program
  .command('pull')
  .description('Copy kubernetes database into a local postgres container')
  .action(function(command, params){
    run()
  })
  .on('--help', function(){
    console.log("    Check 'mp pg -h' for global options")
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ mp pg pull');
    console.log('')
    console.log('    To change the current project, look:')
    console.log('      $ mp p set -h')
    console.log('');
  });
}
module.exports = load
