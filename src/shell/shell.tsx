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
import { Directory, Fs } from '../core/fs';
import { Cd } from './cd';
import { Ls } from './ls';
import { Help } from './help';
import { Clear } from './clear';

const Prompt = React.forwardRef<HTMLSpanElement, { cwd: string }>(
  ({ cwd }, ref) => (
    <span ref={ref}>
      <span className="color-primary-0">user</span>
      <span className="color-primary-0">@</span>
      <span className="color-primary-2">fred-choi.com:</span>
      <span className="color-primary-1">{cwd}$</span>{' '}
    </span>
  )
);

const scripts: { [command: string]: (args: ShellScriptArgs) => ShellScript } = {
  welcome: (args: ShellScriptArgs) => new Welcome(args),
  cat: (args: ShellScriptArgs) => new Cat(args),
  cd: (args: ShellScriptArgs) => new Cd(args),
  ls: (args: ShellScriptArgs) => new Ls(args),
  dir: (args: ShellScriptArgs) => new Ls(args),
  help: (args: ShellScriptArgs) => new Help(args),
  clear: (args: ShellScriptArgs) => new Clear(args),
  clr: (args: ShellScriptArgs) => new Clear(args)
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

  public cwd: Directory;
  private fs_: Fs;
  get fs() {
    return this.fs_;
  }

  private promptRefs: HTMLSpanElement[] = [];
  private willKeepCommandInView: boolean;

  private tabCompletions: string[] = null;
  private tabCompletionIndex = 0;

  constructor({ terminal, dev }: { terminal: Terminal; dev?: boolean }) {
    this.terminal = terminal;
    this.terminal.onKeyDown(this.handleKeydown);

    this.dev = dev || false;

    this.lineBufferEditor = new LineBufferEditor({ terminal });
    this.lineBufferEditor.onFlush(this.handleFlush);
  }

  private handleFlush = (e: LineBufferEditorFlushEvent) => {
    this.historyLine = 0;

    const buffer = e.target.buffer;
    this.lineBufferEditor.reset();

    if (
      !this.runningScript ||
      !(this.runningScript instanceof IOShellScript) ||
      !this.runningScript.handleInput(buffer)
    ) {
      this.lineBufferEditor.hide();
      this.terminal.buffer.push(<br />);
      this.terminal.render();
      this.processingQueue.push(buffer);
    }
  };

  private showPrompt() {
    this.terminal.buffer.push(
      <Prompt
        cwd={'~' + this.cwd.path}
        ref={ref => this.promptRefs.push(ref)}
      />
    );
    this.lineBufferEditor.show();
    this.terminal.render();

    if (
      this.willKeepCommandInView &&
      this.promptRefs[this.promptRefs.length - 2]
    ) {
      this.promptRefs[this.promptRefs.length - 2].scrollIntoView();
      this.willKeepCommandInView = false;
    }
  }

  // TODO: update url to last command run

  private async processLine(line: string) {
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
      case 'Tab':
        this.nextCompletion();
        break;
      default:
        this.tabCompletions = null;
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
      this.lineBufferEditor.cursorPos = this.lineBufferEditor.buffer.length;
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
      this.lineBufferEditor.cursorPos = this.lineBufferEditor.buffer.length;
      this.lineBufferEditor.update();
    }
  }

  private nextCompletion() {
    const args = this.lineBufferEditor.buffer.split(' ');
    if (!this.tabCompletions) {
      if (args.length === 1 && !(args[0] in scripts)) {
        this.tabCompletions = Object.keys(scripts)
          .filter(command => command.startsWith(args[0]))
          .map(command => command + ' ');
        this.tabCompletionIndex = 0;
      } else if (args[0] in scripts) {
        this.tabCompletions = scripts[args[0]]({ shell: this }).tabCompletions(
          this.lineBufferEditor.buffer
        );
        this.tabCompletionIndex = 0;
      } else {
        this.tabCompletions = [];
      }
    }

    if (this.tabCompletions.length > 0) {
      this.lineBufferEditor.buffer = this.tabCompletions[
        this.tabCompletionIndex
      ];
      this.lineBufferEditor.cursorPos = this.lineBufferEditor.buffer.length;
      this.lineBufferEditor.update();

      this.tabCompletionIndex =
        (this.tabCompletionIndex + 1) % this.tabCompletions.length;
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

  async init() {
    this.fs_ = new Fs();
    await this.fs_.init();
    this.cwd = this.fs_.root;
  }

  /**
   * Scrolls the command (by index in history) into view when the next prompt shows
   */
  keepCommandInView() {
    this.willKeepCommandInView = true;
  }
}

const injectCommand = (
  shell: Shell,
  title: string,
  command: string | string[],
  permalink?: string
) => {
  if (Array.isArray(command)) {
    shell.run(...command);
  } else {
    shell.run(command);
  }
  if (permalink) {
    document.title = 'Fred Choi: ' + title;
    window.history.pushState(
      permalink,
      title,
      shell.dev ? '/dev' + permalink : permalink
    );
  }
};
export const CommandLink = ({
  label,
  command,
  shell,
  permalink,
  special
}: {
  label: string;
  command: string | string[];
  shell: Shell;
  permalink?: string;
  special?: boolean;
}) => (
  <a
    onClick={(e: React.MouseEvent) => {
      e.preventDefault();
      injectCommand(shell, label, command, permalink);
    }}
    className={special && 'special'}
    href={shell.dev ? '/dev' + permalink : permalink}
  >
    {label}
  </a>
);
