import * as React from 'react';
import { ShellScript } from './shell-script';

export class Help extends ShellScript {
  main(args: string[]) {
    const buffer = this.shell.terminal.buffer;
    buffer.push('cat [filename]     - displays the contents of a file\n');
    buffer.push('cd [directory]     - changes the current working directory\n');
    buffer.push('clr                - alias for clear\n');
    buffer.push('clear              - clears the screen\n');
    buffer.push('dir                - alias for ls\n');
    buffer.push('help               - shows this screen\n');
    buffer.push(
      'ls                 - list the contents of the current working directory\n'
    );
    buffer.push('party [start|stop] - party time!\n')
    buffer.push('welcome            - show the intro\n');
    this.shell.terminal.render();
  }
}
