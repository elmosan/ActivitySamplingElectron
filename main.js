const electron = require('electron');

// Module to control application life.
const app = electron.app;
const Tray = electron.Tray;
const Menu = electron.Menu;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const storage = require('electron-json-storage');
// const ticker = require('./timer.js');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let appIcon;
let iconPath = path.join(__dirname, 'Kxmylo-Simple-Utilities-system-monitor.ico');
let dataPath = storage.getDataPath();

// Check if other instance is running
let singleInstance = !app.makeSingleInstance(function(cmdArgs, workDir){

  if(mainWindow){
    if (mainWindow.isMinimized()){
      mainWindow.restore();
    }

    mainWindow.focus();
  }
});

// Close if other instance is running
if (!singleInstance) {
  app.quit()
}

function createWindow () {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: 'ActivitySampling',
    icon: iconPath,
    width: 800,
    height: 600
  });

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // console.log(dataPath, new Date());
  storage.set('ActivitySampling', { devTools: true, timerIntervall: 900000 });

  storage.get('ActivitySampling', function(error, data){
    if (error) throw error;

    console.log(data, new Date());

    if (data.devTools) {
      mainWindow.toggleDevTools();
    }
  });

  appIcon = new Tray(iconPath);
  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'About'
    },
    {
      label: 'Open',
      click: function() {
        mainWindow.show();
      }
    },
    {
      label: 'Exit',
      click: function() {
        mainWindow.close();
		// app.quit();
      }
    }]);

  appIcon.setToolTip('Activity Logger');
  appIcon.setContextMenu(contextMenu);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
