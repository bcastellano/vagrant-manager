'use strict';

const debug = require('debug')('vagrant-manager:vagrant');
const EventEmitter = require('events');
const spawn = require('child_process').spawn;

/**
 * Vagrant class to get vagrant information
 */
class Vagrant extends EventEmitter {

  constructor(){
    super();
    this.loadMachines();
  }

  /**
   * Load vagrant machines generated
   */
  loadMachines() {
    const cmd = spawn('vagrant', ['global-status']);
    let text = '';

    // get data from command
    cmd.stdout.on('data', (data) => {
      text = `${text}${data}`;
    });

    // on error
    cmd.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    // command finish
    cmd.on('close', (code) => {
      console.log(`child process exited with code ${code}`);

      const items = this.processText(text);

      this.emit('load', items);
    });
  }

  /**
   *
   * @param text
   */
  processText(text) {
    const items = [];
    const cols = {};

    // iterate each line to extract info
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() == '') {
        break;
      }

      // set header
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

      // add each line
      if (i > 1) {
        const item = {};
        let start = 0;
        Object.keys(cols).forEach((value) => {
          item[value] = lines[i].substr(start, cols[value].length).trim();

          start += cols[value].length;
        });

        // add item
        items.push(item);
      }
    }

    debug(items);

    return items;
  }
}

module.exports = new Vagrant();