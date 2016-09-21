'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { SplitButton, MenuItem, Glyphicon } from 'react-bootstrap';
const vagrant = require('electron').remote.require('./vagrant');

/**
 * Actions for machine
 */
class ActionsButton extends React.Component {

  constructor() {
    super();

    this._btn = {
      up:         { name: 'up', icon: 'play' },
      destroy:    { name: 'destroy', icon: 'remove' },
      provision:  { name: 'provision', icon: 'cloud-download' },
      ssh:        { name: 'ssh', icon: 'console' },
      suspend:    { name: 'suspend', icon: 'pause' },
      halt:       { name: 'halt', icon: 'stop' },
    }

    this.executeAction = this.executeAction.bind(this)
  }

  /**
   * Get list of buttons based on machine state
   * @param state
   * @returns {Array}
   */
  getButtons(state) {
    const buttons = [];

    switch (state) {
      case 'stopped':
        buttons.push(this._btn.up);
        buttons.push(this._btn.destroy);
        buttons.push(this._btn.provision);
        break;
      case 'running':
        buttons.push(this._btn.ssh);
        buttons.push(this._btn.suspend);
        buttons.push(this._btn.halt);
        buttons.push(this._btn.destroy);
        buttons.push(this._btn.provision);
        break;
      case 'poweroff':
        buttons.push(this._btn.up);
        buttons.push(this._btn.destroy);
        buttons.push(this._btn.provision);
        break;
      case 'saved':
      default:
        buttons.push(this._btn.up);
        buttons.push(this._btn.destroy);
        buttons.push(this._btn.provision);
        break;
    }

    return buttons;
  }

  executeAction(cmd) {
    const result = vagrant.exec(cmd, this.props.machineId);
    console.log(result);
  }

  /**
   * Render component
   * @returns XML
   */
  render(){
    const buttons = this.getButtons(this.props.state);
    const mainButton = buttons.shift();
    const buttonList = buttons.map((btn, key)=>{
      return <MenuItem key={key} onClick={this.executeAction.bind(this,btn.name)}><Glyphicon glyph={btn.icon} /> {btn.name}</MenuItem>;
    });

    return (
      <SplitButton title={<span><Glyphicon glyph={mainButton.icon} /> {mainButton.name}</span>}
                   id={`actions-dropdown-${this.props.machineId}`}
                   onClick={this.executeAction.bind(this,mainButton.name)}>
        { buttonList }
      </SplitButton>
    )
  }
}

/**
 * Define component properties
 * @type {{state: *}}
 */
ActionsButton.propTypes = {
  state: React.PropTypes.string.isRequired,
  machineId: React.PropTypes.string.isRequired
}


export { ActionsButton }
