import * as React from 'react';
import { Shell } from './shell';

const injectCommand = (shell: Shell, command: string, permalink?: string) => {
  shell.hideEditor();
  shell.run(command);

  if (permalink) {
    window.history.pushState(
      permalink,
      command,
      shell.dev ? '/dev' + permalink : permalink
    );
  }
};

const CommandLink = ({
  label,
  command,
  shell,
  permalink
}: {
  label: string;
  command: string;
  shell: Shell;
  permalink?: string;
}) => <a onClick={() => injectCommand(shell, command, permalink)}>{label}</a>;

const Links = ({ shell }: { shell: Shell }) => (
  <>
    <CommandLink label="Home" command="welcome" shell={shell} permalink="/" />{' '}
    <CommandLink
      label="About"
      command="cat about.md"
      shell={shell}
      permalink="/about"
    />{' '}
    <a href="/resources/assets/Resume.pdf" target="_blank">
      Resume
    </a>{' '}
    <a href="https://github.com/koreanwglasses" target="_blank">
      <i className="fab fa-github" />
    </a>{' '}
    <a href="https://www.linkedin.com/in/fred-choi" target="_blank">
      <i className="fab fa-linkedin" />
    </a>
  </>
);

export const Navigation = ({ shell }: { shell: Shell }) => (
  <>
    <br />
    <Links shell={shell} />
    <br />
    <br />
    <span className="info">
      Navigate using the links above, or type in a command below!
    </span>
    <br />
    <span className="info">
      If you're stuck, try typing 'help', then hit enter.
    </span>
    <br />
    <br />
  </>
);
