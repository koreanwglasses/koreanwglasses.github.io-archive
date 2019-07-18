import * as React from 'react';
import { Terminal } from '../core/terminal';
import {
  LineBufferEditor,
  LineBufferEditorFlushEvent
} from './line-buffer-editor';
import { Welcome } from './welcome';
import { ShellScriptArgs, ShellScript, IOShellScript } from './shell-script';

const Prompt = ({ cwd }: { cwd: string }) => (
  <>
    <span className="color-primary">user</span>
    <span className="color-primary">@</span>
    <span className="color-primary">fred-choi.com:</span>
    <span className="color-primary">{cwd}$</span>{' '}
  </>
);

const scripts: { [command: string]: (args: ShellScriptArgs) => ShellScript } = {
  welcome: (args: ShellScriptArgs) => new Welcome(args)
};

export class Shell {
  readonly terminal: Terminal;
  private lineBufferEditor: LineBufferEditor;

  private processQueue: Promise<void> = Promise.resolve();
  private runningScript: ShellScript = null;

  // TODO: Create prompter

  constructor({ terminal }: { terminal: Terminal }) {
    this.terminal = terminal;

    this.lineBufferEditor = new LineBufferEditor({ terminal });
    this.lineBufferEditor.onFlush(this.handleFlush);
  }

  private handleFlush = (e: LineBufferEditorFlushEvent) => {
    this.terminal.buffer.push(<br />);
    this.terminal.render();

    const buffer = e.target.buffer;
    this.lineBufferEditor.reset();

    if (
      !this.runningScript ||
      !(this.runningScript instanceof IOShellScript) ||
      !this.runningScript.handleInput(buffer)
    ) {
      this.processQueue = this.processQueue.then(() =>
        this.processLine(buffer)
      );
    }
  };

  private showPrompt() {
    this.terminal.buffer.push(<Prompt cwd="~" />);
    this.terminal.render();
  }

  private async processLine(line: string) {
    const args = line.split(/\s+/g);
    const command = args[0];

    if (command in scripts) {
      this.runningScript = scripts[command]({ shell: this });
      const result = this.runningScript.main(args);
      if (result instanceof Promise) {
        await result;
      }
      this.runningScript = null;
    } else if (command !== '') {
      this.terminal.buffer.push(`${command}: command not found\n`, <br />);
    }

    this.showPrompt();
  }

  start() {
    this.showPrompt();
  }
}
