import { ShellScript } from './shell-script';
import { Fs, Directory } from '../core/fs';

export class Cd extends ShellScript {
  destroy() {}

  handleError(message: string) {
    this.shell.terminal.buffer.push(`~bash: cd: ${message}\n`);
    this.shell.terminal.render();
  }

  main(args: string[]) {
    if (args.length == 1) {
      this.shell.cwd = this.shell.fs.root;
      return;
    }
    if (args.length == 2) {
      const node =
        args[1][0] === '/'
          ? this.shell.fs.root.get(args[1])
          : this.shell.cwd.get(args[1]);
      if(node === null) {
        this.handleError(`${args[1]}: no such file or directory`);
        return;
      }
      if (!(node instanceof Directory)) {
        this.handleError(`${args[1]}: not a directory`);
        return;
      }
      this.shell.cwd = node;
      return;
    }
    this.handleError('too many arguments');
  }
}
