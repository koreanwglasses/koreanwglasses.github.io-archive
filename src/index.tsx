import { Shell } from './shell/shell';
import { Terminal } from './core/terminal';
import { Fs } from './core/fs';

const dev = window.location.pathname.startsWith('/dev');

export const start = async (command?: string) => {
  document.getElementById('root').innerHTML = '';

  window.onpopstate = () => {
    location.reload();
  };

  const terminal = new Terminal({ container: document.getElementById('root') });
  const shell = new Shell({ terminal, dev });
  terminal.render();
  terminal.console.current.focus();

  await shell.init();
  if (!command) {
    await shell.run('welcome --skip-intro');
  } else {
    await shell.run(
      'welcome --skip-intro',
      ...command.split(';').map(str => str.trim())
    );
    terminal.console.current.scrollToTop();
  }

  // @ts-ignore
  MathJax.Hub.Config({
    tex2jax: {
      inlineMath: [['$', '$']],
      processEscapes: true
    }
  });
};
