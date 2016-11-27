'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { SettingsForm } from '../../components/settings-form.react'
import machines from '../machines'
import vagrant from '../../services/vagrant';


class Settings {

    show(){

        /**
         * Execute to go back
         */
        const backClick = ()=>{
            // reload vagrant configuration changes
            vagrant.loadConfiguration();

            // show machines list
            machines.show();
        }

        // render section title
        ReactDOM.render(
            <i>settings</i>, 
            document.getElementById('section-name')
        )

        // render settings form
        ReactDOM.render(
            <SettingsForm backClick={backClick}/>,
            document.getElementById('content')
        );
    }
}

module.exports = new Settings();
