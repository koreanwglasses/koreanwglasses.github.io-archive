import * as React from 'react';
import { ShellScript } from './shell-script';
import { File, Directory, Node } from '../core/fs';
import { CommandLink } from './shell';

const compareStrings = (a: string, b: string) => {
  const alower = a.toLowerCase();
  const blower = b.toLowerCase();
  if (alower == blower) return 0;
  if (alower < blower) return -1;
  if (alower > blower) return 1;
};

const compareNodes = (a: Node, b: Node): number => {
  const aIsDir = a instanceof Directory;
  const bIsDir = b instanceof Directory;
  if (aIsDir && bIsDir) {
    return compareStrings(a.name, b.name);
  }
  if (aIsDir && !bIsDir) {
    return -1;
  }
  if (!aIsDir && bIsDir) {
    return 1;
  }
  if (a instanceof File && b instanceof File) {
    if (!a.frontMatter.date && !b.frontMatter.date) {
      return compareStrings(a.name, b.name);
    }
    if (!a.frontMatter.date) {
      return 1;
    }
    if (!b.frontMatter.date) {
      return -1;
    }

    const aDate = new Date(a.frontMatter.date);
    const bDate = new Date(b.frontMatter.date);
    return aDate < bDate ? 1 : -1;
  }
};

export class Ls extends ShellScript {
  destroy() {}

  private handleWarning(message: string) {
    this.shell.terminal.buffer.push(
      <span className="color-secondary-1-0">{'warning: ' + message}</span>,
      <br />
    );
    this.shell.terminal.render();
  }

  main(args: string[]): void | Promise<void> {
    if (args.length > 1) {
      this.handleWarning('arguments not currently supported');
    }

    const buffer = this.shell.terminal.buffer;
    buffer.push(
      <span className="info">
        Type 'cat [filename]', 'cd [directory]', or click on one of the links
        below!
      </span>,
      <br />
    );

    const nodes = this.shell.cwd.list();
    nodes.sort(compareNodes);
    for (const node of nodes) {
      if (node instanceof Directory) {
        buffer.push(
          'drw--r--r-- 1 (directory) ',
          <CommandLink
            label={node.name}
            command={[`cd ${node.name}`, 'ls']}
            shell={this.shell}
            permalink={node.path}
            special
          />,
          '\n'
        );
      }
      if (node instanceof File && !node.name.startsWith('index')) {
        buffer.push(
          '-rw--r--r-- 1 ',
          (node.frontMatter.date || '').padStart(11, ' '),
          ' ',
          <CommandLink
            label={node.name}
            command={`cat ${node.name}`}
            shell={this.shell}
            permalink={node.path.slice(0, node.path.lastIndexOf('.'))}
          />,
          '\n'
        );
      }
    }
    this.shell.terminal.render();
  }
}
