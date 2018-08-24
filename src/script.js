// global.$ = window.$
const electron = require('electron')
const ipcRenderer = electron.ipcRenderer
const $ = require('jquery')

const script = module.exports = {
  activity: '',
  entry: '',
  createLogEntry: createLogEntry,
  createLogEntryFromText: createLogEntryFromText,
  readLog: readLogFile
}

function readLogFile() {
  let list = $('#lstOutput')[0]
  let lines = ipcRenderer.sendSync('logfile-read')

  for (let line = 0; line < lines.length; line++) {
    createListElement(lines[line], list)
  }
}

function createLogEntry() {
  let input = $('#inputActivity')[0].value

  script.activity = input
  createLogEntryFromText(input)
}

function createLogEntryFromText(text) {
  let list = $('#lstOutput')[0]
  let entry = ipcRenderer.sendSync('logfile-create-entry', text)

  script.entry = entry
  createListElement(entry, list)
}

function createListElement(text, list) {
  if (text.length === 0) {
    return
  }

  let entry = document.createElement('li')
  let att = document.createAttribute('tabindex')

  text = text.replace('  ', '\xa0\xa0')
  att.value = '1'
  entry.classList.add('list-group-item')
  entry.setAttributeNode(att)
  entry.appendChild(document.createTextNode(text))
  // list.appendChild(entry)
  list.insertBefore(entry, list.children[0])

  entry.addEventListener('dblclick', selectText)
}

function selectText(evt) {
  let entry = evt.target
  let text = entry.innerText.substr(21)

  $('#inputActivity')[0].value = text
}

function onKeyUp(evt) {
  if (evt.keyCode === 13) {
    createLogEntry()
  }
}

function onBtnLog(evt) {
  createLogEntry()
}

$(() => {
  $('#inputActivity')[0].addEventListener('keyup', onKeyUp)
  $('#btnLog')[0].addEventListener('click', onBtnLog)
})

readLogFile()
