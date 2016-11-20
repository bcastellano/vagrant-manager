'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { SplitButton, MenuItem, Glyphicon, Button } from 'react-bootstrap';
import vagrant from '../services/vagrant';

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
      //ssh:        { name: 'ssh', icon: 'console' },
      suspend:    { name: 'suspend', icon: 'pause' },
      halt:       { name: 'halt', icon: 'stop' },
    }
  }

  /**
   * Get list of buttons based on machine state
   * @param state
   * @returns {Array}
   */
  getButtons(state) {
    const buttons = [];

    switch (state) {
      case 'running':
        buttons.push(this._btn.suspend, this._btn.halt, this._btn.destroy, this._btn.provision);
        break;
      case 'stopped':
      case 'poweroff':
      case 'aborted':
      case 'saved':
      default:
        buttons.push(this._btn.up, this._btn.destroy, this._btn.provision);
        break;
    }

    return buttons;
  }

  /**
   * Execute vagran command
   * @param cmd
   */
  executeAction(cmd) {
    if (cmd != 'destroy' || confirm('¿Seguro que quieres destuir la máquina?')) {
      const result = vagrant.exec(cmd, this.props.machineId);
      console.log(result);
    }
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

/**
 * Button to do something and show busy state
 */
class LoadingButton extends React.Component {
  constructor() {
    super();

    this.state = {
      isLoading: false
    }

    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    let isLoading = this.state.isLoading;
    return (
      <Button
        bsStyle="primary"
        disabled={isLoading}
        onClick={!isLoading ? this.handleClick : null}>
        {isLoading ? this.props.textLoading : this.props.text}
      </Button>
    );
  }

  handleClick() {
    this.setState({isLoading: true});

    const promise = this.props.onClick();

    promise
      .then((value)=>{
        this.setState({isLoading: false});
      })
      .catch((err)=>{
        console.log(err);
        this.setState({isLoading: false});
      });
  }
}

/**
 * Define component properties
 * @type {{state: *}}
 */
LoadingButton.propTypes = {
  text: React.PropTypes.any,
  textLoading: React.PropTypes.any,
  onClick: React.PropTypes.func.isRequired
}

/**
 * Define default values for not required properties
 * @type {{text: string, textLoading: XML}}
 */
LoadingButton.defaultProps = {
  text: 'actualizar',
  textLoading: <span>actualizando <Glyphicon glyph="refresh" /></span>,
};


export { ActionsButton, LoadingButton }
