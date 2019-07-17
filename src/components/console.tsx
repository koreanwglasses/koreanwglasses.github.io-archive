import * as React from 'react';

const noop = () => {};

interface ConsoleProps {
  buffer: React.ReactNode;
  onInput: (e: React.FormEvent<HTMLInputElement>) => void;
}

/**
 * Handles rendering and input
 */
export class Console extends React.Component<ConsoleProps> {
  static defaultProps = {
    onInput: noop
  };

  private input = React.createRef<HTMLInputElement>();

  private focus = () => {
    this.input.current.focus();
  };

  render() {
    return (
      <>
        <input
          type="text"
          className="console-input"

          ref={this.input}
          onInput={e => this.props.onInput(e)}
        />
        <div className="console" onClick={this.focus}>
          {this.props.buffer}
        </div>
      </>
    );
  }
}
