import * as React from 'react';
import { Terminal, TerminalBeforeRenderEvent } from '../core/terminal';

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

  private startPos: number = 0;

  /**
   * The position of the cursor within the buffer
   */
  cursorPos: number = 0;

  constructor({ terminal }: { terminal: Terminal }) {
    this.terminal = terminal;
    this.terminal.onBeforeRender(this.handleTerminalBeforeRender);
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
    this.terminal.render({ caller: this });
  };

  private flush = () => {
    this.maxBufLen = Math.max(this.maxBufLen, this.buffer.length);

    const event = { target: this };
    this.lineBufferEditorFlushEventHandlers.forEach(callback =>
      callback(event)
    );
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

    this.terminal.render({ caller: this });
  };

  reset() {
    this.maxBufLen = Math.max(this.maxBufLen, this.buffer.length);
    this.terminal.buffer.splice(this.startPos, this.maxBufLen);
    this.terminal.cursor.position = this.startPos;

    this.maxBufLen = 0;
    this.buffer = '';
    this.cursorPos = 0;

    this.terminal.render({ caller: this });
  }

  private handleTerminalBeforeRender = (e: TerminalBeforeRenderEvent) => {
    if (e.caller != this) {
      this.startPos = this.terminal.buffer.length;
    }
    this.maxBufLen = Math.max(this.maxBufLen, this.buffer.length);
    this.terminal.buffer.splice(this.startPos, this.maxBufLen, this.buffer);
    this.terminal.cursor.position = this.startPos + this.cursorPos;
  };

  onFlush(callback: LineBufferEditorFlushEventHandler) {
    this.lineBufferEditorFlushEventHandlers.push(callback);
  }
}
