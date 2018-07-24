const WindowsBalloon = require('node-notifier').WindowsBalloon
// const WindowsToaster = require('node-notifier').WindowsToaster
const path = require('path')
const script = require('./script.js')

let notifier
// let notifier = new WindowsToaster({})

function doNotify(evt) {
  notifier = new WindowsBalloon({})

  notifier.notify({
    title: 'ActivitySampling Current Activity',
    message: `What are you doing? \r\rLast activity: ${script.activity}\r`,
    icon: path.join(__dirname, 'Kxmylo-Simple-Utilities-system-monitor.ico'),
    sound: true,
    time: 8000,
    wait: true,
    type: 'info'
  },
  (err, response) => {
    throw err
  })

  notifier.on('click', (notifierObject, options) => {
    // Triggers if `wait: true` and user clicks notification
    script.createLogEntry()
  })

  notifier.on('timeout', (notifierObject, options) => {
    // Triggers if `wait: true` and notification closes
  })
}

// ipcRenderer.on('timer-message', (event, arg) => {
//   doNotify()
// })

// document.addEventListener('DOMContentLoaded', () => {
//   document.getElementById("btnStart").addEventListener("click", doNotify)
// })

setInterval(() => {
  console.log('Timer intervall', new Date())
  // ipcRenderer.send('timer-message', 'tick')

  let args
  doNotify(args)
}, 900000)
