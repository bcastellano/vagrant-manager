'use strict';

const {remote} = require('electron');
const vagrant = remote.require('../app/vagrant');
const React = require('react');
const ReactDom = require('react-dom');

// Subscribe to vagrant event load machines
vagrant.on('load', (items)=>{

  // Render each machine from list
  ReactDom.render(
    <section>
      List of vagrant machines:
      <ul>
        {items.map((item, key) => <li key={key}>{item.name}</li> )}
      </ul>
    </section>,
    document.getElementById('content'),
  );

  console.log('items loaded');
});