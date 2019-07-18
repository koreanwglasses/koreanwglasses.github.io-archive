import * as React from 'react';
import { ShellScript } from './shell-script';
import { sleep } from '../utils/async';

export class Welcome extends ShellScript {
  async main(args: string[]) {
    this.shell.terminal.buffer.push('Hello world!', <br/>);
    this.shell.terminal.render();
    await sleep(1000);
    this.shell.terminal.buffer.push('tuff', <br/>);
    this.shell.terminal.render();
    await sleep(1000);
  }
}
