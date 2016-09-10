'use strict';

const debug = require('debug')('vagrant-manager:main');

const {app,BrowserWindow} = require('electron');
const path = require('path');

app.on('ready', ()=> {
  debug('app ready');

  if (process.platform=='darwin') {
    app.dock.hide() //Hide the icon in osx dock
  }

  const mainViewPath = path.join('file://', __dirname, '/../views/main.html')

  let win = new BrowserWindow({ width: 400, height: 320 })

  // debug
  win.setSize(1000,600)
  win.webContents.openDevTools()
  win.show()

  win.on('close', function () { win = null });
  win.loadURL(mainViewPath);
  win.show();

});


process.on('exit', function (code) {
  debug('Process exited with code ' + code);
  console.log('Process exited with', code);
});