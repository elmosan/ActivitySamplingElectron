const electron = require('electron')

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const Tray = electron.Tray
const Menu = electron.Menu
const MenuItem = electron.MenuItem
let AppMenu = null

const path = require('path')
const url = require('url')
const storage = require('electron-json-storage')
const log = require('./log.js')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null
let appTray = null
const iconPath = path.join(__dirname, 'Kxmylo-Simple-Utilities-system-monitor.ico')
const storagePath = storage.getDataPath()
let storageData = { 'TimerIntervall': 0, 'DevTools': false }

function createSingleInstance() {
  // Check if other instance is running
  let singleInstance = !app.makeSingleInstance((cmdArgs, workDir) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }

      mainWindow.focus()
    }
  })

  // Close if other instance is running
  if (!singleInstance) {
    app.quit()
  }
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: 'ActivitySampling',
    icon: iconPath,
    width: 800,
    height: 600
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('close', (e) => {
    log.writeLogEntry('Stop logging')
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', (e) => {
    // script.createLogEntry('Stop Logging')

    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  AppMenu = Menu.getApplicationMenu()
  extendAppMenu()
  createTrayIcon()

  storage.get('ActivitySampling', (error, data) => {
    if (error) throw error

    readStorage(data)

    if (storageData.DevTools) {
      mainWindow.toggleDevTools()
      let fileMenu = AppMenu.items[0]
      let optionsMenu = fileMenu.submenu.items[1]
      let devToolsMenu = optionsMenu.submenu.items[0]
      devToolsMenu.checked = true
    }
  })

  log.writeLogEntry('Start logging')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', (e) => {
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', (e) => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', (e) => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

createSingleInstance()

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function extendAppMenu() {
  let fileMenu = AppMenu.items[0]

  fileMenu.submenu.insert(0, new MenuItem(
    {
      label: 'Send',
      click: () => {
        mainWindow.webContents.send('MainWindowStatus', 'OnSend')
      }
    }))

  fileMenu.submenu.insert(1, new MenuItem(
    {
      label: 'Options',
      click: () => {
      },
      submenu: [
        {
          label: 'DevTools',
          type: 'checkbox',
          click: () => {
            mainWindow.toggleDevTools()
            let optionsMenu = fileMenu.submenu.items[1]
            let devToolsMenu = optionsMenu.submenu.items[0]
            storageData.DevTools = devToolsMenu.checked
            saveStorage()
          }
        }
      ]
    }))
}

function createTrayIcon() {
  appTray = new Tray(iconPath)
  let contextMenu = Menu.buildFromTemplate([
    {
      label: 'About'
    },
    {
      label: 'Open',
      click: () => {
        mainWindow.show()
      }
    },
    {
      label: 'Exit',
      click: () => {
        mainWindow.close()
        // app.quit()
      }
    }])

  appTray.setToolTip('Activity Logger')
  appTray.setContextMenu(contextMenu)
}

function readStorage(data) {
  storageData.TimerIntervall = data.TimerIntervall
  storageData.DevTools = data.DevTools
}

function saveStorage() {
  storage.set('ActivitySampling',
    {
      DevTools: storageData.DevTools,
      TimerIntervall: storageData.TimerIntervall
    })
}
