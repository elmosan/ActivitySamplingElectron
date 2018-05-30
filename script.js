// global.$ = window.$;
const $ = require('jquery');
const jetpack = require('fs-jetpack');
const logfile = 'ActivitySampling.log';

module.exports = script = {
  activity: '',
  entry: '',
  logfile: logfile,
  writeLog: writeLogFile,
  readLog: readLogFile
}

function readLogFile(){
  let list = $('#lstOutput')[0];
  let lines = readLinesFromFile();

  for(let line = 0; line < lines.length; line++){
    createListElement(lines[line], list);
  }
}

function readLinesFromFile(){
  if(jetpack.exists(logfile)){
    let log = jetpack.read(logfile);
    let lines = log.split('\n');

    return lines;
  }
}

function writeLogFile(){
  let timeStamp = getTimeStamp();
  let input = $('#inputActivity')[0].value;
  let list = $('#lstOutput')[0];
  script.activity = input;
  script.entry = text = timeStamp + "  " + input + " \n";

  writeToLogFile(text);
  createListElement(text, list);
}

function writeToLogFile(text){
  if (!jetpack.exists(logfile)) {
    jetpack.write(logfile, text, { atomic: true });
  }
  else {
    jetpack.append(logfile, text, {});
  }
}

function createListElement(text, list){
  if (text.length === 0){
    return;
  }

  let entry = document.createElement('li');
  let att = document.createAttribute('tabindex');

  att.value = "1";
  entry.classList.add('list-group-item');
  entry.setAttributeNode(att);
  entry.appendChild(document.createTextNode(text));
  // list.appendChild(entry);
  list.insertBefore(entry, list.children[0]);

  entry.addEventListener("dblclick", selectText);
}

function selectText(evt){
  let entry = evt.target;
  let text = entry.innerText.substr(20);

  $('#inputActivity')[0].value = text;
}

function getTimeStamp() {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth()+1; //January is 0!
  let yyyy = today.getFullYear();
  let hh = today.getHours();
  let MM = today.getMinutes();
  let ss = today.getSeconds();

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
    writeLogFile();
  }
}

$(function() {
  $('#inputActivity')[0].addEventListener("keyup", onKeyUp);
  $('#btnLog')[0].addEventListener("click", writeLogFile);
});

readLogFile();
