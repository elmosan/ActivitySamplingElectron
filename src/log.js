// global.$ = window.$
const electron = require('electron')
const ipcMain = electron.ipcMain
const jetpack = require('fs-jetpack')
const logfile = 'ActivitySampling.log'

const log = module.exports = {
  activity: '',
  entry: '',
  logfile: logfile,
  writeLogEntry: createLogEntry,
  readLog: readLinesFromFile,
  getTimeStamp: createTimeStamp
}

function readLinesFromFile() {
  // file.CopyTo($"{_filename.Replace(file.Extension, "")}-{DateTime.Now:yyyyMMddHHmmss}.log.bkp")

  if (jetpack.exists(logfile)) {
    let content = jetpack.read(logfile)
    let lines = content.split('\n')

    return lines
  }
}

function createLogEntry(text) {
  let timeStamp = createTimeStamp()

  log.entry = `${timeStamp}  ${text}\n`
  writeToLogFile(log.entry)

  return log.entry
}

function writeToLogFile(text) {
  if (!jetpack.exists(logfile)) {
    jetpack.write(logfile, text, { atomic: true })
  }
  else {
    jetpack.append(logfile, text, {})
  }
}

function createTimeStamp() {
  let today = new Date()
  let dd = today.getDate()
  let mm = today.getMonth() + 1 // January is 0!
  let yyyy = today.getFullYear()
  let hh = today.getHours()
  let MM = today.getMinutes()
  let ss = today.getSeconds()

  if (dd < 10) {
    dd = `0${dd}`
  }
  if (mm < 10) {
    mm = `0${mm}`
  }
  if (hh < 10) {
    hh = `0${hh}`
  }
  if (MM < 10) {
    MM = `0${MM}`
  }
  if (ss < 10) {
    ss = `0${ss}`
  }

  return `${dd}.${mm}.${yyyy} ${hh}:${MM}:${ss}`
}

ipcMain.on('logfile-write', (e, a) => {
  writeToLogFile(a)
})

ipcMain.on('logfile-read', (e, a) => {
  let lines = readLinesFromFile()

  e.returnValue = lines
})

ipcMain.on('logfile-create-entry', (e, a) => {
  let entry = createLogEntry(a)

  e.returnValue = entry
})
