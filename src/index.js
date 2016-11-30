'use strict';

import machines from './modules/machines'

/**
 * App start
 */
class AppIndex {

    start() {
        this.registerEvents();

        machines.show();
    }

    registerEvents() {
        // listen main process calls
        require('electron').ipcRenderer.on('open', (event, message) => {
            require('./modules/settings').show()
        });
    }
}

(new AppIndex()).start();
