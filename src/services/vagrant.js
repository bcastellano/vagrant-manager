'use strict';

const debug = require('debug')('vagrant-manager:vagrant');
const EventEmitter = require('events');
const spawn = require('child_process').spawn;
const Configuration = require('electron').remote.require('./services/configuration');
import shell from 'shelljs';

/**
 * Vagrant class to get vagrant information
 * 
 * Events:
 *  - loadMachines
 *  - beforeVagrantCommand
 *  - afterVagrantCommand
 */
class Vagrant extends EventEmitter {

  constructor(){
    super();

    /**
     * List of machines
     * Each machine has attrs:
     *  - id
     *  - name
     *  - provider
     *  - state
     *  - directory
     */
    this._machines = [];

    // TODO Open ssh in terminal. Send params avoid confirmation for destroy
    this._commands = ['up', 'suspend', 'halt', /*'ssh', 'destroy',*/ 'provision'];

    // load configuration
    this.loadConfiguration();
  }

  /**
   * Load data from configuration file
   */
  loadConfiguration() {
    // configure vagrant executable path
    this._vagrantExecutable = Configuration.get('vagrant_executable')
  }

  /**
   *
   * @param state
   * @returns {*}
   */
  colorFromState(state) {

    // primary, info
    const colors = {
      poweroff: 'default',
      stopped: 'danger',
      aborted: 'warning',
      running: 'success',
      saved: 'info'
    };

    return colors[state];
  }

  /**
   * Return list of machines. Only work once load event is emitted
   * @returns {object|null}
   */
  getMachine(id) {
    for (const machine of this._machines) {
      if (machine.id == id) {
        return machine;
      }
    }

    return null;
  }

  /**
   *
   * @param cmd
   * @param machineId
   * @returns {*}
   */
  exec(cmd, machineId) {
    if (this._commands.indexOf(cmd) == -1) {
      debug(`Vagrant command not found: ${cmd}`);
      return;
    }

    const machine = this.getMachine(machineId);
    this.emit('beforeVagrantCommand', { cmd: cmd, machineId: machineId });

    shell.cd(machine.directory);
    shell.exec(`${this._vagrantExecutable} ${cmd}`, (code, stdout, stderr) => {
      this.emit('afterVagrantCommand', { cmd: cmd, machineId: machineId, code: code, stdout: stdout, stderr: stderr });
    });
  }

  up(machineId) {
    this.exec('up', machineId);
  }

  suspend(machineId) {
    this.exec('suspend', machineId);
  }

  halt(machineId) {
    this.exec('halt', machineId);
  }

  provision(machineId) {
    this.exec('provision', machineId);
  }

  ssh(machineId) {
    this.exec('ssh', machineId);
  }

  destroy(machineId) {
    this.exec('destroy', machineId);
  }

  /**
   * Load vagrant machines generated
   */
  loadMachines(removeCache) {
    let text = '';
    let args = ['global-status'];
    if (removeCache == true) {
      args.push('--prune');
    }

    // create promise to return data at finish
    return new Promise((resolve, reject)=>{
      const cmd = spawn(this._vagrantExecutable, args);

      // error executing command
      cmd.on('error', (err) => {
        console.log('[ERROR]' + err);
      });

      // get data from command
      cmd.stdout.on('data', (data) => {
        text = `${text}${data}`;
      });

      // on error
      cmd.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);

        reject(data);
      });

      // command finish
      cmd.on('close', (code) => {
        console.log(`child process exited with code ${code}`);

        if (code == 0) {
          const items = this.processGlobalStatus(text);

          // save list
          this._machines = items;

          // emit event with data loaded async
          this.emit('loadMachines', items);

          resolve(items);

          debug(items);
        } else {
          
          reject(code);

          debug('Error executing command. Exist code: '+code);
        }
      });
    });
  }



  /**
   * Process vagrant global-status text result
   * @param text
   */
  processGlobalStatus(text) {
    const items = [];
    const cols = {};

    // iterate each line to extract info
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      // look for empty line to stop adding machine configurations
      if (lines[i].trim() == '') {
        break;
      }

      // set header with cols data (only once)
      if (i == 0) {
        let lastName;
        for (const name of lines[i].split(' ')) {
          if (name != '') {
            lastName = name;
            cols[lastName] = {length: name.length+1};
          } else {
            cols[lastName].length++;
          }
        }

        continue;
      }

      // add each line (except two first)
      if (i > 1) {
        const item = {};
        let start = 0;
        Object.keys(cols).forEach((value) => {
          // add item col name with line respective data (get positional data)
          item[value] = lines[i].substr(start, cols[value].length).trim();

          // increment offset of line for next parameter
          start += cols[value].length;
        });

        // add item
        items.push(item);
      }
    }

    return items;
  }
}

module.exports = new Vagrant();
