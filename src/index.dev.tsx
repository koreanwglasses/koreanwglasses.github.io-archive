import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Terminal } from './components/terminal';

ReactDOM.render( <Terminal buffer="hello world" />, document.getElementById('root') );