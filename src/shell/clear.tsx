import { Shell } from './shell';
import { ShellScript } from './shell-script';

export class Clear extends ShellScript {
  main(args: string[]) {
    this.shell.terminal.buffer.clear();
    this.shell.terminal.render();
  }
}
