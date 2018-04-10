// global.$ = window.$;
const $ = require('jquery');
const jetpack = require('fs-jetpack');

module.exports = script = {
  activity: '',
  entry: '',
  writeLog: function writeLog(){
    var timeStamp = getTimeStamp();
    var input = $('#inputActivity')[0].value;
    var lst = $('#lstOutput')[0];
    script.activity = input;
    script.entry = text = timeStamp + "; " + input + " \n";

    writeToLogFile(text);
    createListElement(text, lst);
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

function createListElement(text, list){
  var entry = document.createElement('li');
  var att = document.createAttribute('tabindex');

  att.value = "1";
  entry.classList.add('list-group-item');
  entry.setAttributeNode(att);
  entry.appendChild(document.createTextNode(text));
  list.appendChild(entry);

  entry.addEventListener("dblclick", selectText);
}

function selectText(evt){
  var entry = evt.target;
  var text = entry.innerText.substr(20);

  $('#inputActivity')[0].value = text;
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

  return dd+'.'+mm+'.'+yyyy+' '+hh+':'+MM+':'+ss;
}

function onKeyUp(evt) {
  if (evt.keyCode == 13) {
    script.writeLog();
  }
}

$(function() {
  $('#inputActivity')[0].addEventListener("keyup", onKeyUp);
});
