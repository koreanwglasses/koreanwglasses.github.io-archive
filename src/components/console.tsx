import * as React from 'react';

const noop = () => {};

interface ConsoleProps {
  contents: React.ReactNode;
  onInput: React.FormEventHandler<HTMLInputElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
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

  render() {
    // TODO: Allow copying
    return (
      <>
        <input
          type="text"
          className="console-input"
          ref={this.input}
          onInput={this.props.onInput}
          onKeyDown={this.props.onKeyDown}
        />
        <div ref={this.div} className="console-container" onClick={this.focus}>
          <div className="console">{this.props.contents}</div>
        </div>
      </>
    );
  }
}
