import { Shell } from './shell';

export type ShellScriptArgs = { shell: Shell };

export abstract class ShellScript {
  protected shell: Shell;
  constructor({ shell }: ShellScriptArgs) {
    this.shell = shell;
  }

  abstract destroy(): void | Promise<void>;

  abstract main(args: string[]): void | Promise<void>;

  tabCompletions(currentBuffer: string): string[] { return []; }
}

export abstract class IOShellScript extends ShellScript {
  /**
   * Handles input from terminal. Input is buffered. Returns true if the input is handled/consumed
   */
  handleInput(value: string): boolean {
    return false;
  }
}
