'use strict';

const debug = require('debug')('vagrant-manager:main');

const {app,BrowserWindow} = require('electron');
const path = require('path');
const vagrant = require('./vagrant');

app.on('ready', ()=> {
  debug('ready');

  if (process.platform=='darwin') {
    app.dock.hide() //Hide the icon in osx dock
  }

  debug(__dirname);

  const mainViewPath = path.join('file://', __dirname, '/../views/main.html')

  let win = new BrowserWindow({ width: 400, height: 320 })
  win.on('close', function () { win = null });
  win.loadURL(mainViewPath);
  win.show();

  vagrant.on('load', (items)=>{
    debug(items);
  });

  //Initialize options, then bootstrap the application
  //const options = require('./lib/options')

  /*options.once('initialized',()=>{
   require('./bootstrap')
   })*/

});


process.on('exit', function (code) {
  debug('Process exited with code ' + code);
  console.log('Process exited with', code);
});