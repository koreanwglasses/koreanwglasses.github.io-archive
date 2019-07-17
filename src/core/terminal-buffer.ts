const appendToContents = (
  contents: React.ReactNodeArray,
  value: React.ReactNode
) => {
  const top = contents[contents.length - 1];

  if (typeof top === 'string' && typeof value === 'string') {
    // TODO: Automatically replace multi spaces with nbsps

    return [...contents.slice(0, -1), top + value];
  }

  if (Array.isArray(value)) {
    return [...contents, ...value];
  }

  return [...contents, value];
};

export class TerminalBuffer {
  // TODO: Consistency with private variables
  private contents_: React.ReactNodeArray;

  get contents() {
    return [...this.contents_];
  }
  get length() {
    return this.nodeEndPos(this.contents_.length - 1);
  }

  constructor() {
    this.contents_ = [];
  }

  append(value: React.ReactNode) {
    this.contents_ = appendToContents(this.contents, value);
  }

  clear() {
    this.contents_ = [];
  }

  pop(position: number = this.length) {
    const nodeIndex = this.nodeIndexAtPos(position);
    const node = this.contents_[nodeIndex];
    if (typeof node === 'string') {
      const charIndex = position - this.nodeStartPos(nodeIndex);
      this.contents_[nodeIndex] =
        node.slice(0, charIndex) + node.slice(charIndex + 1);
    } else {
      this.contents_.splice(nodeIndex, 1);
    }
  }

  nodeStartPos(nodeIndex: number) {
    return this.contents_
      .slice(0, nodeIndex)
      .map(node => (typeof node === 'string' ? node.length : 1))
      .reduce((prev, cur) => prev + cur, 0);
  }

  nodeEndPos(nodeIndex: number) {
    const node = this.contents[nodeIndex];
    return (
      this.nodeStartPos(nodeIndex) +
      (typeof node === 'string' ? node.length : 1)
    );
  }

  nodeIndexAtPos(position: number) {
    for (let i = 0; i < this.contents_.length; i++) {
      if (this.nodeEndPos(i) > position) {
        return i;
      }
    }
    return -1;
  }
}

export class TerminalReadonlyBuffer {
  private buffer: TerminalBuffer;

  constructor(buffer: TerminalBuffer) {
    this.buffer = buffer;
  }

  // TODO: See if this can be simplified to contents=this.buffer.contents
  get contents() {
    return this.buffer.contents;
  }

  get length() {
    return this.buffer.length;
  }

  nodeStartPos = (nodeIndex: number) => this.buffer.nodeStartPos(nodeIndex);
  nodeEndPos = (nodeIndex: number) => this.buffer.nodeEndPos(nodeIndex);
  nodeIndexAtPos = (position: number) => this.buffer.nodeIndexAtPos(position);
}
