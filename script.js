// global.$ = window.$;
const $ = require('jquery');
const jetpack = require('fs-jetpack');

function onKeyUp(evt) {
  if (evt.keyCode == 13) {
    var timeStamp = getTimeStamp();
    var input = $('#inputActivity')[0].value;
    var pre = $('#preOutput')[0];
    var text = timeStamp + " " + input + " \n";
    writeToLogFile(text);
    pre.innerHTML += text;
  }
}

function writeToLogFile(text){
  var file = 'ActivitySampling.log';
  if (!jetpack.exists(file)) {
    jetpack.write(file, text, { atomic: true });
  }
  else {
    jetpack.append(file, text, {});
  }
}

function getTimeStamp() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  var hh = today.getHours();
  var MM = today.getMinutes();
  var ss = today.getSeconds();

  if(dd<10){
      dd='0'+dd;
  }
  if(mm<10){
      mm='0'+mm;
  }
  if(hh<10){
    mm='0'+hh
  }
  if(MM<10){
    MM='0'+MM
  }
  if(ss<10){
    ss='0'+ss
  }

  return yyyy+'.'+mm+'.'+dd+' '+hh+':'+MM+':'+ss;
}

// document.addEventListener('DOMContentLoaded', function() {
// document.getElementById("inputActivity").addEventListener("keyup", onKeyUp);
// });

$(function() {
  $('#inputActivity')[0].addEventListener("keyup", onKeyUp);
});
