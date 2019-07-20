import { Shell } from './shell/shell';
import { Terminal } from './core/terminal';

const dev = window.location.pathname.startsWith('/dev');

export const start = async (command?: string) => {
  const terminal = new Terminal({ container: document.getElementById('root') });
  const shell = new Shell({ terminal, dev });
  terminal.render();
  if (!command) {
    shell.run('welcome');
  } else {
    shell.run(
      'welcome --skip-intro',
      ...command.split(';').map(str => str.trim())
    );
  }
};
