const sql = require('sql.js')
const jetpack = require('fs-jetpack')
const dbfile = 'ActivitySampling.sqlite'
const table = 'Activities'
const logEntry = { 'id': 0, 'timeStamp': '12:21 02.01.2018', 'message': 'Standard', 'duration': 0, 'created': '', 'modified': '' }

let db = new sql.Database()

const data = module.exports = {
  table: table,
  createDatabase: createDatabase,
  readDatabase: readDatabase,
  writeDatabase: writeDatabase,
  executeQuery: executeQuery,
  runQuery: runQuery,  
  logEntry: logEntry
}

// https://github.com/kripken/sql.js
function createDatabase() {
  let sqlstr = (`CREATE TABLE ${table}
                (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                TimeStamp DATETIME,
                Message VARCHAR, 
                Duration INTEGER,
                Created DATETIME,
                Modified DATETIME)`)

  db.run(sqlstr)
  writeDatabase()
}

function readDatabase() {
  let dbbuffer = jetpack.read(dbfile, 'buffer')

  if (dbbuffer && dbbuffer.length > 0) {
    let uInts = new Uint8Array(dbbuffer)
    db = new sql.Database(uInts)
  }
  else {
    createDatabase()
  }
}

function writeDatabase() {
  let data = db.export()
  let dbbuffer = Buffer.from(data)
  jetpack.write(dbfile, dbbuffer)
}

function executeQuery(query) {
  let res = db.exec(query)

  return res
}

function runQuery(query) {
  db.run(query)
}
