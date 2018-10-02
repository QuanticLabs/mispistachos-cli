var k8s = require(__base+'utilities/k8s.js')
var cmd = require(__base+'utilities/cmd.js')
var userUtils = require(__base+'utilities/user.js')
var Yaml = require(__base+'utilities/yaml.js')

var checkIfContainerRunning = function(containerName){
  var command = "docker ps -f \"name=_" + containerName + "\""
  console.log("Executing:");
  console.log(command);
  var ret = false;
  cmd.sync(command, function(err,stdout,stderr){
    console.log(stdout)
    // console.log(err)
    // console.log(stderr)
    var output = stdout.trim();
    var runningContainers = 0;
    runningContainers = output.split("\n").length - 1;
    console.log("Running containers: "+runningContainers)
    if(output.length > 0 && runningContainers > 0){
      ret = true;
    }
  });

  return ret
}

var run = function(skipBackupFlagValue, userNamespaceFlagValue, keepFileFlagValue){

  
  var postgresContainerName = userUtils.getContainer("postgres")
  var deploymentName = userUtils.getDeployment(null)
  var namespaceName = userUtils.getNamespace(userNamespaceFlagValue)
  var postgresPodName = userUtils.getPod(postgresContainerName, deploymentName, namespaceName)
  var remoteDatabaseName = 'app_production'
  var localDatabaseName = 'app_development'

  console.log("Checking if postgres container is running locally...")

  if(checkIfContainerRunning(postgresContainerName)){
      console.log("Done!")
  }else{
    console.log("Error: your postgres container must be running")
    process.exit();
  }


  console.log("");

  var timestamp = new Date().getTime().toString()
  var fileName = timestamp+'.dump'
  var remoteDumpPath = '/db_dumps/'+fileName
  var localDumpPath = './db_dumps/'+fileName

  console.log("Droping local database");
  var databaseRereated = true;
  var dropDatabase = "docker-compose exec "+postgresContainerName+" dropdb -h postgres -U postgres "+localDatabaseName
  console.log("Executing command:")
  console.log("  " + dropDatabase)
  cmd.sync(dropDatabase, function(err,stdout,stderr){
    console.log(stdout);
    console.log(stderr);
    // console.log(stderr);
    if(stdout.indexOf("error has occurred.") > -1){
      databaseRereated = false;
    }
  });

  console.log("");
  var createDatabaseCommand = "docker-compose exec "+postgresContainerName+" createdb -h postgres -U postgres "+localDatabaseName
  console.log("Creating empty database");
  console.log("Executing command:")
  console.log("  " + createDatabaseCommand)
  cmd.sync(createDatabaseCommand, function(err,stdout,stderr){
    console.log(stdout)
    if(stderr || err){
      console.log(stderr)
      console.log("Error: Empty database could not be created")
      process.exit();
    }
  });

  console.log("Checking remote dump folder...")
  cmd.sync("kubectl exec -it "+postgresPodName+" -n "+namespaceName+" -c "+postgresContainerName+" -- mkdir -p /db_dumps", function(err, stdout, stderr){
    console.log('Dump folder checked')
  })
    
  var remoteDumpAndBackupCommand = "kubectl exec -it "+postgresPodName+" -n "+namespaceName+" -c "+postgresContainerName+" -- pg_dump -Fc -U postgres -f "+remoteDumpPath + " " + remoteDatabaseName
  console.log("Creating dump file in k8s container...")
  console.log("Executing command:")
  console.log("  " + remoteDumpAndBackupCommand)
  console.log("")

  cmd.sync(remoteDumpAndBackupCommand, function(err, stdout, stderr){
    if(stderr || err){
      console.log(stderr)
      console.log("Error: Dump file could not be created")
      process.exit();
    }
    console.log('Backup created')
  })

  var copyDumpCommand = 'kubectl cp '+namespaceName+'/'+postgresPodName+':'+remoteDumpPath+' '+localDumpPath+' -c postgres'
  console.log('Copying dump file to local folder, path='+localDumpPath)
  console.log('  '+ copyDumpCommand)
  cmd.sync(copyDumpCommand, function(err, stdout, stderr){
    console.log(stdout);
    console.log(stderr);
    console.log('Dump file copied')
  })

  


  console.log("Loading dump in local development database");
  var databaseRestored = true;
  var restoreDatabase = "docker-compose exec -T postgres pg_restore -U postgres -d "+localDatabaseName+" "+localDumpPath
  console.log("Executing command:")
  console.log("  " + restoreDatabase)
  cmd.sync(restoreDatabase, function(err,stdout,stderr){
    console.log(stdout)
    if(stdout.indexOf("error has occurred.") > -1){
      databaseRestored = false;
    }
  });

  console.log('Deleting dump in remote container')
  var deleteRemoteDumpCommand = "kubectl exec -it "+postgresPodName+" -n "+namespaceName+" -c "+postgresContainerName+" -- rm "+remoteDumpPath
  cmd.sync(deleteRemoteDumpCommand, function(err,stdout,stderr){
    
  });

  if(keepFileFlagValue){
    console.log('Skip local dump file delete (--keep option)')
  }else{
    console.log('Deleting dump in local container')
    var deleteLocalDumpCommand = "rm "+localDumpPath
    cmd.sync(deleteLocalDumpCommand, function(err,stdout,stderr){
     
    });

  }
  console.log("Successfully pulled the database!");
}

var load = function(program){
  program
  .command('pull')
  .description('Copy kubernetes database into a local postgres container')
  .action(function(command, params){
    run(program.skipBackup, program.namespace, !!program.keep)
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
