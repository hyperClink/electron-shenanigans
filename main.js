const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

// SET ENV
process.env.NODE_EVN = 'production';

let mainWindow;
let addWindow;

//Listen for app to load
app.on('ready', () => {
  //window
  mainWindow = new BrowserWindow({
    resizable:false,
    width:936,
    height:632,
    webPreferences: {
      nodeIntegration: true
    }
  });
  //load html
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }));
  //quit app
  mainWindow.on('closed', () => {app.quit()});

  //build menu temp
  const mainMenu = Menu.buildFromTemplate(mainMenuTemp);
  //ins
  Menu.setApplicationMenu(mainMenu);
});

//menu temp
const mainMenuTemp = [
  {
    label: 'Quit',
    accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
    click(){
      app.quit();
    }
  }
];

//mac suporet
if (process.platform == 'darwin') {
  mainMenuTemp.unshift({});
};

//dev owo
if(process.env.NODE_EVN !== 'production'){
  mainMenuTemp.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  });
};
