import * as React from 'react';
import { sleep } from '../utils/async';
import { isMobile } from '../utils/environment';

const noop = () => {};

interface ConsoleProps {
  contents: React.ReactNode;
  onInput: React.FormEventHandler<HTMLInputElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * Handles rendering and input
 */
export class Console extends React.Component<ConsoleProps> {
  static defaultProps = {
    onInput: noop,
    onKeyDown: noop
  };

  private input = React.createRef<HTMLInputElement>();
  private div = React.createRef<HTMLDivElement>();

  componentDidMount() {
    this.focus();
  }

  focus = () => {
    this.input.current.focus();
  };

  componentDidUpdate() {
    this.div.current.scrollTop = this.div.current.scrollHeight;
  }

  scrollToTop() {
    this.div.current.scrollTop = this.div.current.clientHeight;
  }

  private handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
      this.focus();
    }
    this.props.onKeyDown(e);
  };

  render() {
    return (
      <>
        <input
          type="text"
          className="console-input"
          ref={this.input}
          onInput={this.props.onInput}
          onKeyDown={this.props.onKeyDown}
        />
        <div
          ref={this.div}
          className="console-container"
          onKeyDown={this.handleKeyDown}
          onClick={this.props.onClick}
          tabIndex={0}
        >
          <div
            className={'console ' + (isMobile() ? 'extra-padding-bottom' : '')}
          >
            {this.props.contents}
          </div>
        </div>
      </>
    );
  }
}
