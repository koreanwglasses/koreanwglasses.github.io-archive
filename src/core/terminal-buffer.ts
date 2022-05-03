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

  push(...items: React.ReactNode[]) {
    this.contents_.push(...items);
  }

  insert(position: number, value: React.ReactNode) {
    const nodeIndex =
      position === this.length
        ? this.contents.length
        : this.nodeIndexAtPos(position);

    const node = this.contents_[nodeIndex];
    if (typeof node === 'string') {
      const charIndex = position - this.nodeStartPos(nodeIndex);
      this.contents_.splice(
        nodeIndex,
        1,
        node.slice(0, charIndex),
        value,
        node.slice(charIndex)
      );
    } else {
      this.contents_.splice(nodeIndex, 0, value);
    }
  }

  clear() {
    this.contents_ = [];
  }

  pop(position: number = this.length - 1) {
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

  splice(index: number, deleteCount: number, ...items: React.ReactNode[]) {
    // TODO: This is currently the most naive implementation possible. Find a better way to do this
    for (let i = 0; i < deleteCount && index < this.length; i++) {
      this.pop(index);
    }
    for (const item of items) {
      this.insert(index, item);
    }
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
