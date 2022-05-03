import * as React from 'react';
import { ShellScriptArgs, IOShellScript } from './shell-script';
import { sleep } from '../utils/async';
import { Links, MainInfo } from './navigation';
import { isMobile } from '../utils/environment';

const welcomeMessage1 = 'Hello,';
const welcomeMessage2 = ' welcome to fred-choi.com!';

const masthead1Text =
  '\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u00A0\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u2588\u2588\u2557\u00A0\u2588\u2588\u2557\n' +
  '\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u00A0\u00A0\u00A0\u00A0\u00A0\u2588\u2588\u2554\u255D\u2588\u2588\u2554\u255D\n' +
  '\u2588\u2588\u2588\u2588\u2588\u2557\u00A0\u00A0\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2588\u2588\u2588\u2557\u00A0\u00A0\u2588\u2588\u2551\u00A0\u00A0\u2588\u2588\u2551\u00A0\u00A0\u00A0\u00A0\u2588\u2588\u2554\u255D\u2588\u2588\u2554\u255D\u00A0\n' +
  '\u2588\u2588\u2554\u2550\u2550\u255D\u00A0\u00A0\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u255D\u00A0\u00A0\u2588\u2588\u2551\u00A0\u00A0\u2588\u2588\u2551\u00A0\u00A0\u00A0\u00A0\u255A\u2588\u2588\u2557\u255A\u2588\u2588\u2557\u00A0\n' +
  '\u2588\u2588\u2551\u00A0\u00A0\u00A0\u00A0\u00A0\u2588\u2588\u2551\u00A0\u00A0\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u00A0\u00A0\u00A0\u00A0\u00A0\u255A\u2588\u2588\u2557\u255A\u2588\u2588\u2557\n' +
  '\u255A\u2550\u255D\u00A0\u00A0\u00A0\u00A0\u00A0\u255A\u2550\u255D\u00A0\u00A0\u255A\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u255D\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u255A\u2550\u255D\u00A0\u255A\u2550\u255D\n';

const masthead2Text =
  '\u2588\u2588\u2557\u00A0\u2588\u2588\u2557\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2557\u00A0\u00A0\u2588\u2588\u2557\u00A0\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u00A0\u2588\u2588\u2557\n' +
  '\u255A\u2588\u2588\u2557\u255A\u2588\u2588\u2557\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2551\u00A0\u00A0\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551\n' +
  '\u00A0\u255A\u2588\u2588\u2557\u255A\u2588\u2588\u2557\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u2588\u2588\u2551\u00A0\u00A0\u00A0\u00A0\u00A0\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2551\u00A0\u00A0\u00A0\u2588\u2588\u2551\u2588\u2588\u2551\n' +
  '\u00A0\u2588\u2588\u2554\u255D\u2588\u2588\u2554\u255D\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u2588\u2588\u2551\u00A0\u00A0\u00A0\u00A0\u00A0\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2551\u00A0\u00A0\u00A0\u2588\u2588\u2551\u2588\u2588\u2551\n' +
  '\u2588\u2588\u2554\u255D\u2588\u2588\u2554\u255D\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2551\u00A0\u00A0\u2588\u2588\u2551\u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551\n' +
  '\u255A\u2550\u255D\u00A0\u255A\u2550\u255D\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u255A\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u255D\u00A0\u00A0\u255A\u2550\u255D\u00A0\u255A\u2550\u2550\u2550\u2550\u2550\u255D\u00A0\u255A\u2550\u255D\n';

const insertBreaks = (text: string) =>
  text.split(/(\n)/g).map(value => (value === '\n' ? <br /> : value));

const Masthead1 = () =>
  isMobile() ? (
    <img src="/resources/assets/masthead1.png" className="masthead-image" />
  ) : (
    <div>{insertBreaks(masthead1Text)}</div>
  );

const Masthead2 = () =>
  isMobile() ? (
    <img src="/resources/assets/masthead2.png" className="masthead-image" />
  ) : (
    <div>{insertBreaks(masthead2Text)}</div>
  );

export class Welcome extends IOShellScript {
  private skip = false;

  handleInput = () => {
    this.skip = true;
    return true;
  };

  private write(value: React.ReactNode) {
    this.shell.terminal.buffer.push(value);
    this.shell.terminal.render();
  }

  private async wait(ms: number) {
    if (!this.skip) await sleep(ms);
  }

  async main(args: string[]) {
    this.shell.terminal.onKeyDown(this.handleInput);
    this.shell.terminal.onInput(this.handleInput);

    (async () => {
      await sleep(500);
      this.shell.terminal.onClick(this.handleInput);
    })();

    if (args.length > 1 && args[1] === '--skip-intro') this.skip = true;

    this.shell.terminal.buffer.clear();
    this.shell.terminal.render();

    if (isMobile()) {
      this.write(<Links shell={this.shell} />);
    }

    if (!this.skip) {
      this.write(<span className="info">Press any key to skip intro</span>);
      this.write(<br />);
      this.write(<br />);
    }

    await this.wait(500);
    for (const letter of welcomeMessage1.split('')) {
      await this.wait(20);
      this.write(letter);
    }
    await this.wait(250);
    for (const letter of welcomeMessage2.split('')) {
      await this.wait(20);
      this.write(letter);
    }

    await this.wait(500);
    this.write('\n');
    await this.wait(100);
    this.write('\n');
    await this.wait(500);
    this.write(<Masthead1 />);
    await this.wait(500);
    this.write(<Masthead2 />);
    await this.wait(1000);

    if (!isMobile()) {
      this.write(<br />);
      this.write(<Links shell={this.shell} />);
      this.write(<br />);
    }

    this.write(<MainInfo />);

    await this.wait(500);

    this.shell.terminal.unregisterInputHandler(this.handleInput);
    this.shell.terminal.unregisterKeyDownEventHandler(this.handleInput);
    this.shell.terminal.unregisterClickEventHandler(this.handleInput);
  }
}
