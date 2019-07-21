import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { ShellScript } from './shell-script';
import { readAll } from '../utils/async';

const fileExt = (filename: string) =>
  filename.slice(filename.lastIndexOf('.') + 1);

export class Cat extends ShellScript {
  destroy() {}

  private handleError(message: string) {
    this.shell.terminal.buffer.push(`cat: ${message}\n`);
    this.shell.terminal.render();
  }

  async main(args: string[]) {
    if (args.length < 2) {
      this.handleError('Missing filename\n');
      return;
    }

    if (args.length > 2) {
      this.handleError('Too many arguments\n');
      return;
    }

    const fileName = args[1];
    const response = await fetch(`/resources/content/${fileName}`);
    if (response.status === 404) {
      this.handleError(`${fileName}: No such file or directory\n`);
      return;
    }
    if (!response.ok) {
      this.handleError(`cat: ${response.status}: ${response.statusText}\n`);
      return;
    }

    const raw = await readAll(response.body);
    const text = String.fromCharCode(...raw);

    switch (fileExt(fileName)) {
      case 'md':
        // filter out front-matter
        const markdown = text.replace(/---[^]*---/, '');
        this.shell.terminal.buffer.push(<ReactMarkdown source={markdown} />);
        break;
      default:
        this.shell.terminal.buffer.push(text);
        break;
    }
    this.shell.terminal.render();
  }
}
