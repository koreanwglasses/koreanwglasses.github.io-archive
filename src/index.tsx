import { Shell } from './shell/shell';
import { Terminal } from './core/terminal';

export const start = async (command?: string, renderStatic?: boolean, dev?: boolean) => {
  if(!renderStatic) {
    dev = window.location.pathname.startsWith('/dev');
    document.getElementById('root').innerHTML = '';

    window.onpopstate = () => {
      location.reload();
    };
  }

  const terminal = new Terminal({ container: renderStatic ? null : document.getElementById('root'), renderStatic });
  const shell = new Shell({ terminal, dev });
  terminal.render();

  await shell.init();
  if (!command) {
    await shell.run('welcome');
  } else {
    await shell.run(
      'welcome --skip-intro',
      ...command.split(';').map(str => str.trim())
    );
    if(terminal.console.current) {
      terminal.console.current.scrollToTop();
    }
  }

  if(renderStatic) {
    console.log(terminal.staticMarkup);
  }

  if(!renderStatic) {
    // @ts-ignore
    MathJax.Hub.Config({
      tex2jax: {
        inlineMath: [['$', '$']],
        processEscapes: true
      }
    });
  }
};
