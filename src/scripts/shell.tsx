import * as React from 'react';
import { Terminal } from '../core/terminal';
import {
  LineBufferEditor,
  LineBufferEditorFlushEvent
} from './line-buffer-editor';

export class Shell {
  private terminal: Terminal;
  private editor: LineBufferEditor;

  constructor({ terminal }: { terminal: Terminal }) {
    this.terminal = terminal;

    this.editor = new LineBufferEditor({ terminal });
    this.editor.onFlush(this.handleFlush);
  }

  private handleFlush = (e: LineBufferEditorFlushEvent) => {
    this.terminal.buffer.push(e.target.buffer, <br />);
    e.target.startPos += e.target.buffer.length + 1;
  };
}
