import * as React from 'react';
import { Shell, CommandLink } from './shell';
import { isMobile } from '../utils/environment';

export const Links = ({ shell }: { shell: Shell }) => (
  <div className={isMobile() ? 'sticky' : ''}>
    <CommandLink label="Home" command="welcome" shell={shell} permalink="/" />
    {'\u2002\u2002'}
    <CommandLink
      label="About"
      command="cat /about.md"
      shell={shell}
      permalink="/about"
    />
    {'\u2002\u2002'}
    <CommandLink
      label="Projects"
      command={['cd /projects', 'ls']}
      shell={shell}
      permalink="/projects"
    />
    {'\u2002\u2002'}
    <a href="/resources/assets/Resume.pdf">Resume</a>
    {'\u2002\u2002'}
    <a href="https://github.com/koreanwglasses">
      <i className="fab fa-github" />
    </a>
    {'\u2002\u2002'}
    <a href="https://www.linkedin.com/in/fred-choi">
      <i className="fab fa-linkedin" />
    </a>
  </div>
);

export const MainInfo = () => (
  <>
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
