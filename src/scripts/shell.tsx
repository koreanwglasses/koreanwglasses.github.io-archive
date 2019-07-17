import { Terminal } from "../core/terminal";
import { write } from "fs";

export class Shell {
  private terminal: Terminal;

  constructor({terminal} : {terminal: Terminal}) {
    this.terminal = terminal;
    this.terminal.onInput(this.handleInput);
  }

  private handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value;
    this.terminal.write(value);
  } 
}

