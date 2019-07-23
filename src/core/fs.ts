import { fetchJSON, fetchText } from '../utils/async';

type FileData = {
  frontMatter: { [property: string]: any };
  isFile: boolean;
};

type DirectoryData = {
  contents: { [path: string]: DirectoryData | FileData };
  isDirectory: boolean;
};

type NodeData = FileData | DirectoryData;

function isFileData(obj: NodeData): obj is FileData {
  return 'isFile' in obj && obj.isFile;
}

function isDirectoryData(obj: NodeData): obj is DirectoryData {
  return 'isDirectory' in obj && obj.isDirectory;
}

export abstract class Node {
  readonly directory: Directory;
  readonly path: string;

  constructor({ path, directory }: { path: string; directory: Directory }) {
    this.directory = directory;
    this.path = path;
  }

  get name() {
    return this.path.slice(this.path.lastIndexOf('/') + 1);
  }
}

export class File extends Node {
  private fileData: FileData;
  constructor({
    directory,
    path,
    fileData
  }: {
    directory: Directory;
    path: string;
    fileData: FileData;
  }) {
    super({ directory, path });
    this.fileData = fileData;
  }

  get frontMatter() {
    return this.fileData.frontMatter;
  }

  async readText() {
    return await fetchText('/resources/content' + this.path);
  }
}

export class Directory extends Node {
  private nodes: Node[];
  private nodeMap: { [name: string]: Node };

  private constructor({
    directory,
    path
  }: {
    directory: Directory;
    path: string;
  }) {
    super({ directory, path });
  }

  list() {
    return this.nodes;
  }

  // Returns a list of all paths and subpaths in this directory
  tree(args? : {filesOnly?: boolean, relative?: boolean}): string[] {
    const defaultArgs = {filesOnly: false, relative: true};
    const {filesOnly, relative} = {...defaultArgs, ...args};

    const paths = [];
    for(const node of this.nodes) {
      if(node instanceof Directory) {
        if(!filesOnly) {
          paths.push(this.path);
        }
        paths.push(...node.tree({filesOnly, relative: false}));
      } else {
        paths.push(node.path);
      }
    }
    return relative ? paths.map(path => path.slice(this.path.length + 1)) : paths;
  }

  /**
   * @param relativePath
   * @throws NoSuchFileOrDirectoryError, NotADirectoryError
   */
  get(relativePath: string): Node {
    if (!relativePath) return this;

    const name =
      relativePath.indexOf('/') === -1
        ? relativePath
        : relativePath.slice(0, relativePath.indexOf('/'));
    const nextPath =
      relativePath.indexOf('/') === -1
        ? ''
        : relativePath.slice(relativePath.indexOf('/') + 1);

    if (name === '' || name === '.') {
      return this.get(nextPath);
    }
    if (name === '..') {
      return (this.directory || this).get(nextPath);
    }
    const node = this.nodeMap[name];
    if (!node) return null;
    if (node instanceof File) {
      if (nextPath) {
        return null;
      } else {
        return node;
      }
    }
    if (node instanceof Directory) {
      if (nextPath) {
        return node.get(nextPath);
      } else {
        return node;
      }
    }
    return null;
  }

  private setNodes(nodes: Node[]) {
    this.nodes = nodes;
    this.nodeMap = {};
    for (const node of nodes) {
      this.nodeMap[node.name] = node;
    }
  }

  static fromDirectoryData({
    directoryData,
    path,
    parent
  }: {
    directoryData: DirectoryData;
    path: string;
    parent: Directory;
  }): Directory {
    const directory = new Directory({ directory: parent, path });
    const nodes = Object.keys(directoryData.contents).map(key => {
      const nodeData = directoryData.contents[key];
      if (isDirectoryData(nodeData)) {
        return Directory.fromDirectoryData({
          parent: directory,
          directoryData: nodeData,
          path: path + '/' + key
        });
      } else {
        return new File({
          directory,
          path: path + '/' + key,
          fileData: nodeData
        });
      }
    });
    directory.setNodes(nodes);
    return directory;
  }
}

export class Fs {
  private root_: Directory = null;

  get root() {
    return this.root_;
  }

  async init() {
    const metaData: { [path: string]: NodeData } = await fetchJSON(
      '/resources/content/meta.json'
    );
    const rootData: DirectoryData = { contents: metaData, isDirectory: true };
    this.root_ = Directory.fromDirectoryData({
      directoryData: rootData,
      path: '',
      parent: null
    });
  }

  get(fullpath: string) {
    return this.root_.get(fullpath);
  }
}
