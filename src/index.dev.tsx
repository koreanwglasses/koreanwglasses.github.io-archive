import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Console } from './components/console';
import { Shell } from './shell/shell';
import { Terminal } from './core/terminal';

const terminal = new Terminal({ container: document.getElementById('root') });
const shell = new Shell({ terminal });
terminal.render();

(async () => {
  if (window.location.href.indexOf('#') !== -1) {
    const firstCommand = decodeURI(
      window.location.href.slice(window.location.href.indexOf('#') + 1)
    );
    await shell.run('welcome --skip-intro');
    shell.hideEditor();
    terminal.buffer.push(firstCommand, <br />);
    shell.run(firstCommand);
  } else {
    shell.run('welcome');
  }
})();
