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
    this.interval = setInterval(this.tick, 10000 / this.props.width);
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

export class DiscoBall extends React.Component<{}, {}> {
  render() {
    return (
      <div className="disco-ball-container">
        <div className="disco-ball">
          <Line width={10} />
          <Line width={16} />
        </div>
      </div>
    );
  }
}
