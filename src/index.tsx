import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Console } from './components/console';
import { Shell } from './shell/shell';
import { Terminal } from './core/terminal';


(async () => {
  let pathName = window.location.pathname.slice(1);
  let dev = false;
  if(pathName.startsWith('dev')) {
    pathName = pathName.slice(3);
    dev = true;
  }

  const terminal = new Terminal({ container: document.getElementById('root') });
  const shell = new Shell({ terminal, dev });
  terminal.render();

  if(pathName) {
    const firstCommand = `cat ${pathName}.md`;
    await shell.run('welcome --skip-intro');
    shell.hideEditor();
    terminal.buffer.push(firstCommand, <br />);
    shell.run(firstCommand);
  } else if (window.location.href.indexOf('#') !== -1) {
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
