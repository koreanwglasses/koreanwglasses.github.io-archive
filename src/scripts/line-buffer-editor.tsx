import * as React from 'react';
import { Terminal } from '../core/terminal';

export interface LineBufferEditorFlushEvent {
  target: LineBufferEditor;
}

type LineBufferEditorFlushEventHandler = (
  event: LineBufferEditorFlushEvent
) => void;

export class LineBufferEditor {
  private terminal: Terminal;
  private lineBufferEditorFlushEventHandlers: LineBufferEditorFlushEventHandler[] = [];
  private maxBufLen = 0; // the longest the buffer has been

  buffer: string = '';

  /**
   * The starting position of the editable region
   */
  startPos: number = 0;

  /**
   * The position of the cursor within the buffer
   */
  cursorPos: number = 0;

  constructor({ terminal }: { terminal: Terminal }) {
    this.terminal = terminal;
    this.terminal.onInput(this.handleInput);
    this.terminal.onKeyDown(this.handleKeyDown);
  }

  private handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value;

    // Update local buffer
    this.buffer =
      this.buffer.slice(0, this.cursorPos) +
      value +
      this.buffer.slice(this.cursorPos);
    this.cursorPos += value.length;

    // TODO: Handle multi line input
    this.render();
  };

  private flush = () => {
    const event = { target: this };
    
    this.lineBufferEditorFlushEventHandlers.forEach(callback =>
      callback(event)
    );

    this.buffer = ''; 
    this.cursorPos = 0;
    this.render();
  };

  private handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        this.flush();
        break;
      case 'Backspace':
        if (this.cursorPos > 0) {
          this.buffer =
            this.buffer.slice(0, this.cursorPos - 1) +
            this.buffer.slice(this.cursorPos);
          this.cursorPos--;
        }
        break;
      case 'Delete':
        if (this.cursorPos < this.buffer.length) {
          this.buffer =
            this.buffer.slice(0, this.cursorPos) +
            this.buffer.slice(this.cursorPos + 1);
        }
        break;
      case 'ArrowLeft':
        if (this.cursorPos > 0) {
          this.cursorPos--;
        }
        break;
      case 'ArrowRight':
        if (this.cursorPos < this.buffer.length) {
          this.cursorPos++;
        }
        break;
      default:
        return; // Return without re-rendering
    }

    this.render();
  };

  render() {
    this.maxBufLen = Math.max(this.maxBufLen, this.buffer.length);
    this.terminal.buffer.splice(this.startPos, this.maxBufLen, this.buffer);
    this.terminal.cursor.position = this.startPos + this.cursorPos;
    this.terminal.render();
  }

  onFlush(callback: LineBufferEditorFlushEventHandler) {
    this.lineBufferEditorFlushEventHandlers.push(callback);
  }
}
