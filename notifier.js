const WindowsBalloon = require('node-notifier').WindowsBalloon;
// const WindowsToaster = require('node-notifier').WindowsToaster;
const path  = require('path');

var notifier = new WindowsBalloon({});
// var notifier = new WindowsToaster({});

function doNotify(evt){
  notifier.notify({
    title: 'ActivitySampling',
    message: 'What are you doing?',
    icon: path.join(__dirname, 'Kxmylo-Simple-Utilities-system-monitor.ico'),
    sound: true,
    time: 5000,
    wait: true,
    type: 'info'
  },
  function(err, response){

  });

  notifier.on('click', function(notifierObject, options) {
    // Triggers if `wait: true` and user clicks notification
  });

  notifier.on('timeout', function(notifierObject, options) {
    // Triggers if `wait: true` and notification closes
  });
}


document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("btnStart").addEventListener("click", doNotify);
});
