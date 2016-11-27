'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Well, Table, Label } from 'react-bootstrap';
import { ActionsButton, LoadingButton } from '../../components/react-components';
import vagrant from '../../services/vagrant';

class Machines {

    constructor() {
        this.subscribeVagrantEvents()
    }

    show() {
        /**
         * Load initial machines
         */
        vagrant.loadMachines()
            .catch(function(){
                if (confirm('Vagrant executable not found, ¿Do you want to configure it?')) {
                    require('../settings').show()
                }
            });
    }

    subscribeVagrantEvents() {
        /**
         * Subscribe to vagrant event load machines
         */
        vagrant.on('loadMachines', (items)=>{
            // Render section title
            ReactDOM.render(
                <i>machines list</i>, 
                document.getElementById('section-name')
            )

            // Render each machine from list
            ReactDOM.render(
                <Well bsSize="large">
                <LoadingButton onClick={()=>vagrant.loadMachines(true)} />
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
        });

        /**
         * 
         */
        vagrant.on('beforeVagrantCommand', (object)=>{
            console.log('antes de ejecutar');
        })

        /**
         * Reload table on command execute
         */
        vagrant.on('afterVagrantCommand', (object)=>{
            console.log(object);
            this.show();
        })
    }
}

module.exports = new Machines()