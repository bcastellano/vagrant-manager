'use strict';

const debug = require('debug')('vagrant-manager:configuration');
const storage = require('electron-json-storage');
const { EventEmitter } = require('events');

/**
 * Load configuration file
 * 
 * Events:
 *  - initialized
 */
class Configuration extends EventEmitter {

    constructor () {
        super();

        // storage file
        this.storageFile = 'vagrant-manager-config'
        
        debug('configuration-file', require('path').resolve(require('electron').app.getPath('userData'), this.storageFile + '.json'));

        // Default configuration
        this.config = {
            vagrant_executable: 'vagrant'
        }

        // Load configuration file 
        this._loadConfiguration();
    }

    /**
     * Return configuration value
     *
     * @param key
     * @returns {*}
     */
    get(key) {
        return this.config[key];
    }

    /**
     * Sets configuration value
     *
     * @param key
     * @param value
     */
    set(key, value) {
        this.config[key] = value;

        this._saveConfiguration();
    }

    /**
     * Load configuration file, merge with defaults and store in local variable 
     */
    _loadConfiguration() {
        storage.get(this.storageFile, (err, data) => {
            if (err) {
                debug('error loading', err);
                throw err;
            }

            // merge config data
            Object.assign(this.config, data)
            debug('Configuration loaded', this.config)

            // emit event when data is loaded
            this.emit('initialized')
        });
    }

    /**
     * Save configuration data in file
     */
    _saveConfiguration() {
        debug('Configuration to save', this.config)

        storage.set(this.storageFile, this.config, function(err) {
            if (err) {
                debug('error saving', err);
                throw err;
            }
        });
    }
}

module.exports = new Configuration();