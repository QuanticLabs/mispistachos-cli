var k8s = require(__base+'utilities/k8s.js')
var cmd = require(__base+'utilities/cmd.js')
var userUtils = require(__base+'utilities/user.js')
var gcloud = require(__base+'utilities/gcloud.js')
var Yaml = require(__base+'utilities/yaml.js')

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

var run = function(skipBackupFlagValue){
  var postgresContainerName = userUtils.getContainer("postgres")
  var cronContainerName = userUtils.getContainer("cron")
  var webContainerName = userUtils.getContainer("web")
  var deploymentName = userUtils.getDeployment(null)

  console.log("Checking if postgres container is running locally...")

  if(checkIfContainerRunning(postgresContainerName)){
      console.log("Done!")
  }else{
    console.log("Error: your postgres container must be running")
    process.exit();
  }

  console.log("");

  console.log("Checking if web is stopped locally...")
  if(checkIfContainerRunning("web")){
    console.log("Error: you must stop web container")
    process.exit();
  }else{
    console.log("Done!")
  }

  console.log("");

  console.log("Checking if sidekiq is stopped locally...")
  if(checkIfContainerRunning("sidekiq")){
    console.log("Error: you must stop sidekiq container")
    process.exit();
  }else{
    console.log("Done!")
  }

  console.log("");

  if(!!skipBackupFlagValue){
    console.log("Skipping the creation of a new backup.")
    console.log("");
  }
  else{
    console.log("Searching pod for container '"+cronContainerName+"'")
    var podName = userUtils.getPod(cronContainerName, deploymentName)
    var remoteDumpAndBackupCommand = "kubectl exec -it "+podName+" -c "+cronContainerName+" /commands/dump_db_and_backup.sh"
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
  }

  console.log("Recreating the development database");
  var databaseRereated = true;
  var dropDatabase = "docker-compose run --rm "+cronContainerName+" dropdb -h postgres -U postgres app_development"
  console.log("Executing command:")
  console.log("  " + dropDatabase)
  cmd.sync(dropDatabase, function(err,stdout,stderr){
    console.log(stdout);
    // console.log(stderr);
    if(stdout.indexOf("error has occurred.") > -1){
      databaseRereated = false;
    }
  });
  console.log("");
  var createDatabase = "docker-compose run --rm "+cronContainerName+" createdb -h postgres -U postgres app_development"
  console.log("Executing command:")
  console.log("  " + createDatabase)
  cmd.sync(createDatabase, function(err,stdout,stderr){
    console.log(stdout);
    // console.log(stderr);
    if(stdout.indexOf("error has occurred.") > -1){
      databaseRereated = false;
    }
  });
  if(databaseRereated === false){
    console.log("Error recreating database app_development ");
    process.exit();
  }

  currentProject = gcloud.getCurrentProject();
  console.log("The following variable should be equal to the CURRENT_PROJECT environment variable on k8s. You can check it with 'kubectl proxy' and checking the secrets.");
  console.log("currentProject: ",currentProject)

  // We get the Amazon Credentials from the root folder
  var configPath = process.cwd()+"/config/s3.yml"
  var yaml = new Yaml(configPath)
  yaml.load()
  console.log("\nS3 variables to use:")
  yaml.print()
  console.log("")
  var envVars = yaml.values

  console.log("Restoring the development database");
  var databaseRestored = true;
  var restoreDatabase = "docker-compose run --rm -e S3_KEY_ID="+envVars['S3_KEY_ID']+" -e S3_SECRET_ACCESS_KEY="+envVars['S3_SECRET_ACCESS_KEY']+" -e BUCKET_NAME="+envVars['BUCKET_NAME']+" -e CURRENT_PROJECT="+currentProject+" cron /commands/restore_last_backup.sh"
  console.log("Executing command:")
  console.log("  " + restoreDatabase)
  cmd.sync(restoreDatabase, function(err,stdout,stderr){
    console.log(stdout);
    if(stdout.indexOf("error has occurred.") > -1){
      databaseRestored = false;
    }
  });

  if(databaseRereated === false){
    console.log("Error restoring the database.");
  }
  else{
    console.log("Successfully pulled the database!");
  }
}

var load = function(program){
  program
  .command('pull')
  .description('Copy kubernetes database into a local postgres container')
  .action(function(command, params){
    run(program.skipBackup)
  })
  .on('--help', function(){
    console.log("    Check 'mp pg -h' for global options")
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ mp pg pull');
    console.log('    $ mp pg pull -s');
    console.log('')
    console.log('    To change the current project, look:')
    console.log('      $ mp p set -h')
    console.log('');
  });
}
module.exports = load
