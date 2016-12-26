'use strict';

const debug = require('debug')('vagrant-manager:tray');

const path = require('path')
const {Tray,Menu} = require('electron')

class AppTray {

    constructor() {
        this.tray = null;
    }

    start() {
        const iconName = '/../../resources/' + (process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png')
        this.tray = new Tray(path.join(__dirname, iconName))
        const contextMenu = Menu.buildFromTemplate([
            {label: 'Item1', type: 'radio'},
            {label: 'Item2', type: 'radio'},
            {label: 'Item3', type: 'radio', checked: true},
            {label: 'Item4', type: 'radio'}
        ])
        this.tray.setToolTip('This is my application.')
        this.tray.setContextMenu(contextMenu)
    }
}

module.exports = new AppTray();