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
    this.terminal.buffer.push(e.target.buffer);
  };
}
