'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { SplitButton, MenuItem } from 'react-bootstrap';

/**
 * Actions for machine
 */
class ActionsButton extends React.Component {

  constructor() {
    super();
  }

  render(){
    const state = this.props.state;

    return (
      <SplitButton bsStyle="default" title={state} id={`split-button-basic-${state}`}>
        <MenuItem eventKey="1">Action</MenuItem>
        <MenuItem eventKey="2">Another action</MenuItem>
        <MenuItem eventKey="3">Something else here</MenuItem>
        <MenuItem divider />
        <MenuItem eventKey="4">Separated link</MenuItem>
      </SplitButton>
    )
  }
}

ActionsButton.propTypes = {
  state: React.PropTypes.string.isRequired
}


export { ActionsButton }
