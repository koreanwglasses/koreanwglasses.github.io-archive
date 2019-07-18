import { Shell } from './shell';

export type ShellScriptArgs = { shell: Shell };

export abstract class ShellScript {
  protected shell: Shell;
  constructor({ shell }: ShellScriptArgs) {
    this.shell = shell;
  }

  abstract main(args: string[]): void | Promise<void>;
}

export abstract class IOShellScript extends ShellScript {
  /**
   * Handles input from terminal. Input is buffered. Returns true if the input is handled/consumed
   */
  handleInput(value: string): boolean {
    return false;
  }
}
