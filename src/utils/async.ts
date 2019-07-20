export const sleep = (ms: number) =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

export class ProcessingQueue<D> {
  private dataQueue: D[] = [];
  private processQueue: Promise<void> = Promise.resolve();

  private callback: (data: D) => void | Promise<void>;

  get queue() {
    return [...this.dataQueue];
  }

  constructor({ callback }: { callback: (data: D) => void }) {
    this.callback = callback;
  }

  push(...data: D[]) {
    this.dataQueue.push(...data);
    this.processQueue = this.processQueue.then(() => this.processNext());
  }

  private async processNext() {
    const result = this.callback(this.dataQueue[0]);
    if (result instanceof Promise) {
      await result;
    }
    this.dataQueue.splice(0, 1);
  }
}

export const readAll = async (stream: ReadableStream) => {
  const reader = stream.getReader();

  let contents = new Uint8Array();

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    const offset = contents.length;
    contents = new Uint8Array(contents.length + value.length);
    contents.set(contents);
    contents.set(value, offset);
  }

  return contents;
};
