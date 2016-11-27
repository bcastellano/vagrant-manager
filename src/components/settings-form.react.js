'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Well, Button, ButtonToolbar, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
const Configuration = require('electron').remote.require('./services/configuration');

/**
 * Settings form
 */
class SettingsForm extends React.Component {

  constructor() {
    super();

    this.state = {
      vagrantExecutable: Configuration.get('vagrant_executable')
    }
  }

  /**
   * Update vagrant executable on edition
   */
  changeValue(event) {
      // update state and configuration file
      this.setState({vagrantExecutable: event.target.value});
      Configuration.set('vagrant_executable', event.target.value);
  }

  /**
   * Render component
   * @returns XML
   */
  render(){
    
    return (
      <Well bsSize="large">
          <form>
              <FormGroup>
                  <ControlLabel>Vagrant executable:</ControlLabel>
                  <FormControl
                      type="text"
                      value={this.state.vagrantExecutable}
                      placeholder="select vagrant executable path"
                      onChange={this.changeValue.bind(this)}
                  />
                  <HelpBlock>This is the vagrant executable path.</HelpBlock>
              </FormGroup>
              <ButtonToolbar>
                  <Button
                      bsStyle="primary"
                      onClick={this.props.backClick}>back
                  </Button>
              </ButtonToolbar>
          </form>
      </Well>
    )
  }
}

/**
 * Define component properties
 */
SettingsForm.propTypes = {
  backClick: React.PropTypes.func.isRequired
}

export { SettingsForm }
