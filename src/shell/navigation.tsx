import * as React from 'react';
import { Shell } from './shell';

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

export const Navigation = ({ shell }: { shell: Shell }) => (
  <>
    <br />
    <Links shell={shell} />
    <br />
    <br />
    <em>Navigate using the links above, or type in a command below!</em>
    <br />
    <em>If you're stuck, try typing 'help', then hit enter.</em>
    <br />
    <br />
  </>
);
