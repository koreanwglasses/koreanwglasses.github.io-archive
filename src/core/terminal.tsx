import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Console } from '../components/console';
import { TerminalCursor, CursorWrapper } from './terminal-cursor';
import { TerminalReadonlyBuffer, TerminalBuffer } from './terminal-buffer';

export interface TerminalInputEvent extends React.FormEvent<HTMLInputElement> {
  readonly wasConsumed: boolean;
}

type TerminalInputHandler = (event: TerminalInputEvent) => boolean | void;

type RenderOptions = {
  autoMoveCursor?: boolean;
};

const defaultRenderOptions = {
  autoMoveCursor: true
};

const injectCursor = (buffer: TerminalBuffer, cursorPosition: number) => {
  if (cursorPosition >= buffer.length) {
    return [...buffer.contents, <CursorWrapper>{'\xa0'}</CursorWrapper>];
  }

  const nodeIndex = buffer.nodeIndexAtPos(cursorPosition);
  const node = buffer.contents[nodeIndex];

  if (typeof node === 'string') {
    const charIndex = cursorPosition - buffer.nodeStartPos(nodeIndex);
    return [
      ...buffer.contents.slice(0, nodeIndex),
      node.slice(0, charIndex),
      <CursorWrapper>{node[charIndex]}</CursorWrapper>,
      node.slice(charIndex + 1),
      ...buffer.contents.slice(nodeIndex + 1)
    ];
  } else {
    return [
      ...buffer.contents.slice(0, nodeIndex),
      <CursorWrapper>{node}</CursorWrapper>,
      ...buffer.contents.slice(nodeIndex + 1)
    ];
  }
};

const replaceSpaces = (contents: React.ReactNodeArray) =>
  contents.map(node =>
    typeof node === 'string'
      ? node.replace(/\t/g, '    ').replace(/ /g, '\u2003')
      : node
  );

const insertLineBreaks = (contents: React.ReactNodeArray) => {
  const result: React.ReactNodeArray = [];
  for (const node of contents) {
    if (typeof node === 'string') {
      const newNodes = node
        .split(/(\n)/g)
        .map(value => (value === '\n' ? <br /> : value));
      result.push(...newNodes);
    } else {
      result.push(node);
    }
  }
  return result;
};

export class Terminal {
  private container: Element;
  readonly console = React.createRef<Console>();

  // TODO: Consistency with private variables
  public buffer: TerminalBuffer = new TerminalBuffer();

  private inputCallbacks: {
    callback: TerminalInputHandler;
    priority: number;
  }[] = [];
  private keyDownCallbacks: React.KeyboardEventHandler<HTMLDivElement>[] = [];

  public cursor: TerminalCursor = new TerminalCursor();

  constructor({ container }: { container: Element }) {
    this.container = container;
  }

  private handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    let wasConsumed = false;

    for (const { callback } of this.inputCallbacks) {
      const event = { ...e, wasConsumed };
      if (callback(event)) wasConsumed = true;
    }

    if (!wasConsumed) {
      this.buffer.push(e.currentTarget.value);
      this.render();
    }

    e.currentTarget.value = '';
  };

  private handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    this.keyDownCallbacks.forEach(callback => callback(e));
  };

  private prepareContents() {
    return insertLineBreaks(
      replaceSpaces(injectCursor(this.buffer, this.cursor.position))
    );
  }

  render(opts: RenderOptions = {}) {
    const { autoMoveCursor } = { ...defaultRenderOptions, ...opts };
    if (autoMoveCursor) {
      this.cursor.position = this.buffer.length;
    }

    ReactDOM.render(
      <Console
        ref={this.console}
        contents={this.prepareContents()}
        onInput={this.handleInput}
        onKeyDown={this.handleKeyDown}
      />,
      this.container
    );
  }

  onInput(callback: TerminalInputHandler, priority: number = 0) {
    this.inputCallbacks.push({ callback, priority });
    this.inputCallbacks.sort((a, b) => a.priority - b.priority);
  }

  onKeyDown(callback: React.KeyboardEventHandler<HTMLInputElement>) {
    this.keyDownCallbacks.push(callback);
  }

  unregisterInputHandler(handler: TerminalInputHandler) {
    const index = this.inputCallbacks.findIndex(
      ({ callback }) => callback === handler
    );
    this.inputCallbacks.splice(index, 1);
  }

  unregisterKeyDownEventHandler(
    handler: React.KeyboardEventHandler<HTMLInputElement>
  ) {
    const index = this.keyDownCallbacks.indexOf(handler);
    this.keyDownCallbacks.splice(index, 1);
  }
}
