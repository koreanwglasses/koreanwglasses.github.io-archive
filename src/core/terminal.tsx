import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Console } from '../components/console';

type InputCallback = (e: React.FormEvent<HTMLInputElement>) => void;

const appendToBuffer = (
  buffer: React.ReactNodeArray,
  value: React.ReactNode
) => {
  const top = buffer[buffer.length - 1];
  
  if (typeof top === 'string' && typeof value === 'string') {
    // TODO: Automatically replace multi spaces with nbsps
    // TODO: Handle \b
    return [...buffer.slice(0, -1), top + value];
  }

  if (Array.isArray(value)) {
    return [...buffer, ...value]
  }

  return [...buffer, value];
};

export class Terminal {
  private container: Element;
  private buffer: React.ReactNodeArray;

  private inputCallbacks: InputCallback[];

  constructor({ container }: { container: Element }) {
    this.container = container;
    this.inputCallbacks = [];
    this.clear();
  }

  private handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    this.inputCallbacks.forEach(callback => callback(e));
    e.currentTarget.value = '';
  }

  private render() {
    ReactDOM.render(<Console buffer={this.buffer} onInput={this.handleInput} />, this.container);
  }

  write(value: React.ReactNode) {
    this.buffer = appendToBuffer(this.buffer, value);
    this.render();
  }

  clear() {
    this.buffer = [];
    this.render();
  }

  onInput(callback: InputCallback) {
    this.inputCallbacks.push(callback);
  }
}