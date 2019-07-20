import * as React from 'react';
import { Terminal } from '../core/terminal';
import {
  LineBufferEditor,
  LineBufferEditorFlushEvent
} from './line-buffer-editor';
import { Welcome } from './welcome';
import { ShellScriptArgs, ShellScript, IOShellScript } from './shell-script';
import { ProcessingQueue, sleep } from '../utils/async';
import { Cat } from './cat';

const Prompt = ({ cwd }: { cwd: string }) => (
  <>
    <span className="color-primary">user</span>
    <span className="color-primary">@</span>
    <span className="color-primary-light-1">fred-choi.com:</span>
    <span className="color-primary-light-2">{cwd}$</span>{' '}
  </>
);

const scripts: { [command: string]: (args: ShellScriptArgs) => ShellScript } = {
  welcome: (args: ShellScriptArgs) => new Welcome(args),
  cat: (args: ShellScriptArgs) => new Cat(args)
};

export class Shell {
  readonly terminal: Terminal;
  private lineBufferEditor: LineBufferEditor;

  private processingQueue: ProcessingQueue<string> = new ProcessingQueue({
    callback: data => this.processLine(data)
  });
  private runningScript: ShellScript = null;

  private history: string[] = [];
  private historyLine = 0;
  private presentBuffer: string = '';

  readonly dev: boolean;

  constructor({ terminal, dev }: { terminal: Terminal; dev?: boolean }) {
    this.terminal = terminal;
    this.terminal.onKeyDown(this.handleKeydown);

    this.dev = dev || false;

    this.lineBufferEditor = new LineBufferEditor({ terminal });
    this.lineBufferEditor.onFlush(this.handleFlush);
  }

  private handleFlush = (e: LineBufferEditorFlushEvent) => {
    this.historyLine = 0;

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

  // TODO: update url to last command run

  private async processLine(line: string) {
    this.lineBufferEditor.hide();

    // Multiple commands
    if (line.indexOf(';') !== -1) {
      this.processingQueue.push(...line.split(';'));
      return;
    }

    const args = line.split(/\s+/g);
    const command = args[0];

    if (command in scripts) {
      this.history.push(line);

      this.runningScript = scripts[command]({ shell: this });
      const result = this.runningScript.main(args);
      if (result instanceof Promise) {
        await result;
      }

      const destroy = this.runningScript.destroy();
      if (destroy instanceof Promise) {
        await destroy;
      }

      this.runningScript = null;
    } else if (command !== '') {
      await sleep(100);
      this.terminal.buffer.push(`${command}: command not found\n`, <br />);
    }

    this.showPrompt();
    if (this.processingQueue.queue.length > 1) {
      this.terminal.buffer.push(this.processingQueue.queue[1], <br />);
      this.terminal.render();
    }
  }

  private handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowUp':
        this.historyBack();
        break;
      case 'ArrowDown':
        this.historyForward();
        break;
    }
  };

  private historyBack() {
    if (this.history.length + this.historyLine > 0) {
      if (this.historyLine === 0)
        this.presentBuffer = this.lineBufferEditor.buffer;
      this.historyLine--;
      const index = this.history.length + this.historyLine;
      this.lineBufferEditor.buffer = this.history[index];
      this.lineBufferEditor.update();
    }
  }

  private historyForward() {
    if (this.historyLine < 0) {
      this.historyLine++;
      if (this.historyLine === 0) {
        this.lineBufferEditor.buffer = this.presentBuffer;
      } else {
        const index = this.history.length + this.historyLine;
        this.lineBufferEditor.buffer = this.history[index];
      }
      this.lineBufferEditor.update();
    }
  }

  hideEditor() {
    this.lineBufferEditor.hide();
  }

  showEditor() {
    this.lineBufferEditor.show();
  }

  async run(...commands: string[]) {
    if (commands.length > 0) {
      for (const command of commands) {
        this.hideEditor();
        this.terminal.buffer.push(command, <br />);
        await this.processLine(command);
      }
    } else {
      this.showPrompt();
    }
  }
}
