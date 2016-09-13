'use strict';

import {remote} from 'electron';
import React from 'react';
import ReactDom from 'react-dom';
import { Well, Table } from 'react-bootstrap';
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
              {Object.keys(item).map((key, index) => <td key={index}>{item[key]}</td> )}
              <td>
                <ActionsButton state={item.state} />
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Well>,
    document.getElementById('content'),
  );

  console.log('items loaded');
});