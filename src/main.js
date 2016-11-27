'use strict';

const debug = require('debug')('vagrant-manager:main');

const {app,BrowserWindow} = require('electron');
const path = require('path');

app.on('ready', ()=> {
  debug('app ready');

  if (process.platform=='darwin') {
    //app.dock.hide() //Hide the icon in osx dock
  }

  let main_window = new BrowserWindow({ width: 1300, height: 1000 })

  // debug
  main_window.setSize(1300,1000)
  main_window.webContents.openDevTools()
  main_window.on('close', function () { main_window = null });

  // load configuration
  let Configuration = require('./services/configuration');
  Configuration.on('initialized', ()=>{
    // show page when configuration has been loaded
    main_window.loadURL(`file://${__dirname}/main.html`);
  })

});


process.on('exit', function (code) {
  debug('Process exited with code ' + code);
  console.log('Process exited with', code);
});