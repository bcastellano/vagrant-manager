'use strict';

import {remote} from 'electron';
import React from 'react';
import ReactDom from 'react-dom';
import { Well, Table, Label } from 'react-bootstrap';
import { ActionsButton } from './react-components'
const vagrant = remote.require('./vagrant');

// Subscribe to vagrant event load machines
vagrant.on('load', (items)=>{
  // Render each machine from list
  ReactDom.render(
    <Well bsSize="large">
      <Table responsive hover>
        <thead>
          <tr>
            {Object.keys(items[0]).map((item, key) => <th key={key}>{item}</th> )}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, key) =>
            <tr key={key}>
              {Object.keys(item).map((key, index) => {
                if (key == 'state') {
                  return <td key={index}><Label bsStyle={vagrant.colorFromState(item[key])}>{item[key]}</Label></td>;
                }
                return <td key={index}>{item[key]}</td>;
              } )}
              <td>
                <ActionsButton state={item.state} machineId={item.id} />
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Well>,
    document.getElementById('content'),
  );

  console.log('items rendered');
});