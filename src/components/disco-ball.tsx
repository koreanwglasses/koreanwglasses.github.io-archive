import * as React from 'react';
import { add, scale, range } from '../utils/array';

const Block = ({ baseColor }: { baseColor: string }) => (
  <span style={{ color: baseColor }}>█</span>
);

// Not a truly random color
const randomColor = () => {
  const cyan = [158, 247, 255];
  const pink = [255, 156, 240];
  const yellow = [252, 255, 158];

  const alpha = Math.random();
  const beta = Math.random();
  const gamma = Math.random() / 2;
  const w = alpha + beta + gamma || 1;

  return add(
    scale(alpha / w, cyan),
    scale(beta / w, pink),
    scale(gamma / w, yellow)
  );
};

const colorToString = (color: number[]) =>
  color.length === 3
    ? `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    : `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;

class Line extends React.Component<
  { width: number },
  { offset: number; baseColors: string[] }
> {
  private interval: NodeJS.Timeout;

  state = {
    offset: 0,
    baseColors: range(this.props.width).map(() => colorToString(randomColor()))
  };

  private tick = () => {
    this.setState(prevState => {
      return {
        offset: prevState.offset + 1,
        baseColors: [
          colorToString(randomColor()),
          ...prevState.baseColors.slice(0, -1)
        ]
      };
    });
  };

  componentDidMount() {
    this.interval = setInterval(this.tick, 5000 / this.props.width);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        {this.state.baseColors.map((color, index) => (
          <Block baseColor={color} key={index - this.state.offset} />
        ))}
      </div>
    );
  }
}

export enum DiscoBallAction {
  Descend,
  Ascend
}

type DiscoBallProps = { action: DiscoBallAction; onStopped: () => void };
type DiscoBallState = { moving: boolean; line: number };

export class DiscoBall extends React.Component<DiscoBallProps, DiscoBallState> {
  static defaultProps = {
    descend: false,
    onStopped: () => {}
  };

  private interval: NodeJS.Timeout;

  state = {
    moving: true,
    line: this.props.action === DiscoBallAction.Descend ? 1 : 14
  };

  private stoppedMoving = () => {
    clearInterval(this.interval);
    this.interval = null;
    this.props.onStopped();
  };

  private tick = () => {
    if (this.state.moving) {
      const descending = this.props.action === DiscoBallAction.Descend;
      this.setState(prevState => {
        return {
          moving: descending ? prevState.line + 1 < 13 : prevState.line - 1 > 0,
          line: descending ? prevState.line + 1 : prevState.line - 1
        };
      });
    } else {
      this.stoppedMoving();
    }
  };

  static getDerivedStateFromProps(
    props: DiscoBallProps,
    state: DiscoBallState
  ) {
    const descending = props.action === DiscoBallAction.Descend;
    return {
      moving: descending ? state.line + 1 < 13 : state.line - 1 > 0
    };
  }

  componentDidUpdate() {
    if (!this.interval) {
      this.interval = setInterval(this.tick, 100);
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  render() {
    return (
      <div className="disco-ball-container">
        <div className="disco-ball">
          {[
            <div key={1}>|</div>,
            <div key={2}>|</div>,
            <div key={3}>|</div>,
            <Line width={9} key={4} />,
            <Line width={13} key={5} />,
            <Line width={15} key={6} />,
            <Line width={15} key={7} />,
            <Line width={15} key={8} />,
            <Line width={15} key={9} />,
            <Line width={15} key={10} />,
            <Line width={13} key={11} />,
            <Line width={9} key={12} />
          ].slice(-this.state.line)}
        </div>
      </div>
    );
  }
}
