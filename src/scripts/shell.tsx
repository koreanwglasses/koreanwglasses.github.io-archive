import * as React from 'react';
import { Terminal } from '../core/terminal';

export class Shell {
  private terminal: Terminal;

  constructor({ terminal }: { terminal: Terminal }) {
    this.terminal = terminal;

    this.terminal.onInput(this.handleInput);
    this.terminal.onKeyDown(this.handleKeyDown);
  }

  private handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value;

    this.terminal.append(value);
    this.terminal.cursor.position = this.terminal.buffer.length;
    this.terminal.render();
  };

  private handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        this.terminal.append(<br />);
        this.terminal.cursor.position++;
        break;
      case 'Backspace':
        this.terminal.pop(this.terminal.cursor.position - 1);
        this.terminal.cursor.position--;
        break;
      case 'Delete':
        if(this.terminal.cursor.position < this.terminal.buffer.length) {
          this.terminal.pop(this.terminal.cursor.position);
          this.terminal.cursor.position--;
        }
        break;
      default:
        return;
    }

    this.terminal.render();
  };
}
