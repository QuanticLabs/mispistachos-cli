

var userUtils = require(__base+'utilities/user.js')
var cmd = require(__base+'utilities/cmd.js')
const opn = require('opn');

var run = function(){

  //kubectl port-forward -n kube-system monitoring-grafana-3552275057-0splp 3010:3000

  console.log("Searching pod for container 'grafana'")

  var podName = userUtils.getPod("grafana", null, "kube-system");

  var fullCommand = "kubectl port-forward -n kube-system "+podName+" 3010:3000"
  console.log("Executing command:")
  console.log("  " + fullCommand)
  console.log("")
  console.log("")

  var params = ['port-forward', '-n', 'kube-system', podName, '3010:3000']
  cmd.execRemote('kubectl', params)
  opn("http://localhost:3010")

}

var load= function(program){
  program
  .command('stats')
  .description('Open Grafana for check cluster usage')
  .action(function(){
    run()
  })
  .on('--help', function(){
    console.log("    Check 'mp k -h' for global options")
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ mp k stats                                       # Check RAM and CPU usage for containers');
    console.log('')
    console.log('    To change the current project, look:')
    console.log('      $ mp p set -h')
    console.log('');
  });
}
module.exports = load
