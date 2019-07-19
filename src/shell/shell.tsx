import * as React from 'react';
import { Terminal } from '../core/terminal';
import {
  LineBufferEditor,
  LineBufferEditorFlushEvent
} from './line-buffer-editor';
import { Welcome } from './welcome';
import { ShellScriptArgs, ShellScript, IOShellScript } from './shell-script';
import { ProcessingQueue } from '../utils/async';

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

  private processingQueue: ProcessingQueue<string> = new ProcessingQueue({
    callback: data => this.processLine(data)
  });
  private runningScript: ShellScript = null;

  constructor({ terminal }: { terminal: Terminal }) {
    this.terminal = terminal;

    this.lineBufferEditor = new LineBufferEditor({ terminal });
    this.lineBufferEditor.onFlush(this.handleFlush);
  }

  private handleFlush = (e: LineBufferEditorFlushEvent) => {
    this.terminal.buffer.push(<br />);

    const buffer = e.target.buffer;
    this.lineBufferEditor.reset();

    this.terminal.render();

    if (
      !this.runningScript ||
      !(this.runningScript instanceof IOShellScript) ||
      !this.runningScript.handleInput(buffer)
    ) {
      this.processingQueue.push(buffer);
    }
  };

  private showPrompt() {
    this.terminal.buffer.push(<Prompt cwd="~" />);
    this.lineBufferEditor.show();
    this.terminal.render();
  }

  private async processLine(line: string) {
    this.lineBufferEditor.hide();

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
    if (this.processingQueue.queue.length > 1) {
      this.terminal.buffer.push(this.processingQueue.queue[1], <br />);
      this.terminal.render();
    }
  }

  start(command?: string) {
    if (command) {
      this.processLine(command);
    } else {
      this.showPrompt();
    }
  }
}
