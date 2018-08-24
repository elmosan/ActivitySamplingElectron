const data = require('./data.js')
const log = require('./log.js')

const repository = module.exports = {
  getAll: getAll,
  getLogEntry: getLogEntry,
  writeEntry: writeEntry,
  updateEntry: updateEntry,
  data: data
}

function writeEntry(logEntry) {
  updateModifierAttributes(logEntry)

  data.runQuery(`INSERT INTO ${data.table} (TimeStamp, Message, Duration, Created, Modified) VALUES (` +
    `'${logEntry.timeStamp}', ` +
    `'${logEntry.message}', ` +
    `${logEntry.duration}, ` +
    `'${logEntry.created}', ` +
    `'${logEntry.modified}')`
  )

  data.writeDatabase()
}

function updateEntry(logEntry) {
  updateModifierAttributes(logEntry)

  data.runQuery(`UPDATE ${data.table}
    SET timestamp = '${logEntry.timeStamp}',
    SET message = '${logEntry.message}',
    SET duration = ${logEntry.duration},
    SET created = '${logEntry.created}',
    SET modified = '${logEntry.modified}'
    WHERE Id = ${logEntry.id}`)

  data.writeDatabase()
}

function getLogEntry(id) {
  let entry = data.executeQuery(`SELECT * FROM ${data.table} WHERE Id = ${id}`)

  return entry
}

function getAll() {
  let entries = data.executeQuery(`SELECT * FROM ${data.table}`)

  return entries
}

function updateModifierAttributes(logEntry) {
  if (!logEntry.created || logEntry.created.length === 0) {
    logEntry.created = log.getTimeStamp()
    logEntry.modified = null
  }
  else {
    logEntry.modified = log.getTimeStamp()
  }
}
