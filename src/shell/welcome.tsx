import * as React from 'react';
import { ShellScript, ShellScriptArgs, IOShellScript } from './shell-script';
import { sleep } from '../utils/async';
import { arch } from 'os';
import { Shell } from './shell';

const welcomeMessage1 = 'Hello visitor.';
const welcomeMessage2 = ' Welcome to fred-choi.com!';

const masthead1 =
  '\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2557       \u2588\u2588\u2557 \u2588\u2588\u2557\n' +
  '\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557     \u2588\u2588\u2554\u255D\u2588\u2588\u2554\u255D\n' +
  '\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2551  \u2588\u2588\u2551    \u2588\u2588\u2554\u255D\u2588\u2588\u2554\u255D \n' +
  '\u2588\u2588\u2554\u2550\u2550\u255D  \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u255D  \u2588\u2588\u2551  \u2588\u2588\u2551    \u255A\u2588\u2588\u2557\u255A\u2588\u2588\u2557 \n' +
  '\u2588\u2588\u2551     \u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D     \u255A\u2588\u2588\u2557\u255A\u2588\u2588\u2557\n' +
  '\u255A\u2550\u255D     \u255A\u2550\u255D  \u255A\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u255D       \u255A\u2550\u255D \u255A\u2550\u255D\n';

const masthead2 =
  '\u2588\u2588\u2557 \u2588\u2588\u2557           \u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2557  \u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2557\n' +
  '\u255A\u2588\u2588\u2557\u255A\u2588\u2588\u2557         \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551\n' +
  ' \u255A\u2588\u2588\u2557\u255A\u2588\u2588\u2557        \u2588\u2588\u2551     \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2551\n' +
  ' \u2588\u2588\u2554\u255D\u2588\u2588\u2554\u255D        \u2588\u2588\u2551     \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2551\n' +
  '\u2588\u2588\u2554\u255D\u2588\u2588\u2554\u255D         \u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2551  \u2588\u2588\u2551\u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551\n' +
  '\u255A\u2550\u255D \u255A\u2550\u255D           \u255A\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u255D  \u255A\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u255D\n';

const injectCommand = (shell: Shell, command: string) => {
  shell.hideEditor();
  shell.terminal.buffer.push(command, <br />);
  shell.run(command);
};

const Command = ({
  label,
  command,
  shell
}: {
  label: string;
  command: string;
  shell: Shell;
}) => <a onClick={() => injectCommand(shell, command)}>{label}</a>;

const Links = ({ shell }: { shell: Shell }) => (
  <Command label="About" command="cat about.md" shell={shell} />
);

export class Welcome extends ShellScript {
  private skip = false;

  constructor(args: ShellScriptArgs) {
    super(args);
    args.shell.terminal.onKeyDown(this.handleSkip);
    args.shell.terminal.onInput(this.handleSkip);
  }

  destroy() {
    this.shell.terminal.unregisterInputHandler(this.handleSkip);
    this.shell.terminal.unregisterKeyDownEventHandler(this.handleSkip);
  }

  private handleSkip = () => {
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
    this.shell.terminal.buffer.clear();
    this.shell.terminal.render();

    this.write(<em>Press any key to skip intro</em>);
    this.write(<br />);
    this.write(<br />);

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
    this.write(masthead1);
    await this.wait(500);
    this.write(masthead2);
    await this.wait(1000);

    this.write(<br />);
    this.write(<Links shell={this.shell} />);
    this.write(<br />);
    this.write(<br />);
    this.write(
      <em>Navigate using the links above, or type in a command below!</em>
    );
    this.write(<br />);
    this.write(<em>If youre stuck, try typing 'help', then hit enter.</em>);
    this.write(<br />);
    this.write(<br />);

    await this.wait(500);
  }
}
