import * as React from 'react';
import { sleep } from '../utils/async';
import { isMobile } from '../utils/environment';
import { DiscoBall, DiscoBallAction } from './disco-ball';
import { classList } from '../utils/react-utils';

const noop = () => {};

interface ConsoleProps {
  contents: React.ReactNode;
  onInput: React.FormEventHandler<HTMLInputElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  partyMode: boolean;
}

interface ConsoleState {
  showDiscoBall: boolean;
}

/**
 * Handles rendering and input
 */
export class Console extends React.Component<ConsoleProps, ConsoleState> {
  static defaultProps = {
    onInput: noop,
    onKeyDown: noop,
    onClick: noop,
    partyMode: false
  };

  state = {
    showDiscoBall: false
  };

  private input = React.createRef<HTMLInputElement>();
  private div = React.createRef<HTMLDivElement>();

  componentDidMount() {
    this.focus();
  }

  focus = () => {
    this.input.current.focus();
  };

  static getDerivedStateFromProps(props: ConsoleProps, state: ConsoleState) {
    return {
      showDiscoBall: props.partyMode || state.showDiscoBall
    };
  }

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

  private handleDiscoBallStopped = () => {
    if (!this.props.partyMode) {
      this.setState({ showDiscoBall: false });
    }
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
            className={classList({
              console: true,
              'extra-padding-bottom': isMobile(),
              party: this.state.showDiscoBall
            })}
          >
            {this.props.contents}
          </div>
        </div>
        {this.state.showDiscoBall && (
          <DiscoBall
            action={
              this.props.partyMode
                ? DiscoBallAction.Descend
                : DiscoBallAction.Ascend
            }
            onStopped={this.handleDiscoBallStopped}
          />
        )}
      </>
    );
  }
}
