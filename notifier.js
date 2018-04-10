const WindowsBalloon = require('node-notifier').WindowsBalloon;
// const WindowsToaster = require('node-notifier').WindowsToaster;
const path  = require('path');
const $ = require('jquery');
const script = require('./script.js');
// const ipcRenderer  = require('electron').ipcRenderer ;

var notifier;
// var notifier = new WindowsToaster({});

function doNotify(evt){
  notifier = new WindowsBalloon({});

  notifier.notify({
    title: 'ActivitySampling',
    message: 'What are you doing?',
    icon: path.join(__dirname, 'Kxmylo-Simple-Utilities-system-monitor.ico'),
    sound: true,
    time: 8000,
    wait: true,
    type: 'info'
  },
  function(err, response){

  });

  notifier.on('click', function(notifierObject, options) {
    // Triggers if `wait: true` and user clicks notification
    script.writeLog();
  });

  notifier.on('timeout', function(notifierObject, options) {
    // Triggers if `wait: true` and notification closes
  });
}

// ipcRenderer.on('timer-message', (event, arg) => {
//   doNotify();
// });

// document.addEventListener('DOMContentLoaded', function() {
  // document.getElementById("btnStart").addEventListener("click", doNotify);
// });

setInterval(function() {
  console.log("Timer intervall", new Date());
  // ipcRenderer.send('timer-message', 'tick');

  var args;
  doNotify(args);

}, 10000);

$(function() {
  $('#btnStart')[0].addEventListener("click", doNotify);
});
