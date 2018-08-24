const path = require('path')
const script = require('./script.js')
// const notifier = require('node-notifier')
const WindowsToaster = require('node-notifier').WindowsToaster

function doNotify(evt) {
  let notifier = new WindowsToaster()

  notifier.notify({
    id: 'ActivitySampling',
    title: 'ActivitySampling Current Activity',
    message: `What are you doing? \r\rLast activity: ${script.activity}\r`,
    icon: path.join(__dirname, 'Kxmylo-Simple-Utilities-system-monitor.ico'),
    sound: true,
    // Windows 10: Ease of Access/Other options/Show notifcations for
    time: 8000,
    wait: true,
    type: 'info'
  },
  (err, res) => {
    if (err) {
      throw err
    }
  })

  notifier.on('click', (obj, opt) => {
    // Triggers if `wait: true` and user clicks notification
    script.createLogEntry()
  })

  notifier.on('timeout', (obj, opt) => {
    // Triggers if `wait: true` and notification closes
  })
}

setInterval(() => {
  console.log('Timer intervall', new Date())
  // ipcRenderer.send('timer-message', 'tick')

  let args
  doNotify(args)
}, 900000)
