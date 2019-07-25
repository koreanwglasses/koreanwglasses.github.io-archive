import { Shell } from './shell';
import { ShellScript } from './shell-script';
import { choose } from '../utils/random';

const partyStartMessages = [
  "Let's get this party started!\n",
  "It's a party!\n",
  'Party time!\n'
];

const partyEndMessages = [
  "Party's over!\n",
];

export class Party extends ShellScript {
  tabCompletions(currentBuffer: string) {
    return ['party start', 'party stop'];
  }

  handleError(message: string) {
    this.shell.terminal.buffer.push(`party: ${message}\n`);
    this.shell.terminal.render();
  }

  main(args: string[]) {
    if (args[1] === 'start') {
      this.shell.terminal.partyMode = true;
      this.shell.terminal.buffer.push(choose(partyStartMessages));
      this.shell.terminal.render();
      return;
    }

    if (args[1] === 'stop') {
      this.shell.terminal.partyMode = false;
      this.shell.terminal.buffer.push(choose(partyEndMessages));
      this.shell.terminal.render();
      return;
    }

    this.handleError('invalid arguments. Usage: party [start|stop]');
  }
}
