import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Console } from './components/console';
import { Shell } from './shell/shell';
import { Terminal } from './core/terminal';

const terminal = new Terminal({ container: document.getElementById('root') });
const shell = new Shell({ terminal });
terminal.render();
shell.start('welcome');
