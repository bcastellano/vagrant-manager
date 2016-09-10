'use strict';

const {remote} = require('electron');
const vagrant = remote.require('../src/vagrant');

// Subscribe to vagrant event load machines
vagrant.on('load', (items)=>{
  const content = document.getElementById('content');
  let html = '<h1>Cargado</h1><ul>';

  for (const item of items) {
    html += `<li>${item.id}</li>`;
  }

  content.innerHTML = html + '</ul>';
});

console.log('ejecutado');