//import { setImmediate, clearImmediate } from './setimmediate-polyfill.js'
// FIXME: Is it fine to use Promise.resolve here? what's the diff from queueMicroTask / setImmediate in Node.js?
const setImmediate = (cb) => {
  Promise.resolve().then(() => {
    cb();
  });
};
import { fsConstants } from './fs-constants.js';
import type * as nodeFs from 'node:fs';

interface FileSystemFile {
  contents: Uint8Array[];
  mode: number;
}

interface FileDescriptor {
  filePath: string;
}

const fileSystemMap = new Map<string, FileSystemFile>();
const fileDescriptors = new Map<number, FileDescriptor>();

let currentMaxFd = 3;
const genFd = () => ++currentMaxFd;

const errorEnoent = () => {
  const err = new Error();
  err.code = 'ENOENT';
  return err;
};

const createFsStats = () => {
  return new Proxy(
    {
      isDirectory() {
        return true;
      },
      isSymbolicLink() {
        return true;
      },
      isFile() {
        return false;
      },
    },
    {
      get(target, prop, receiver) {
        return Reflect.get(target, prop, receiver);
      },
    },
  );
};

const isUtf8 = (encoding: string) => {
  return encoding === 'utf8' || encoding === 'utf-8';
};

const myfs = {
  constants: fsConstants,
  realpathSync: {
    native(filePath: string, options) {
      calconsole.log('myfs.realpathSync.native', filePath, options);
      return filePath;
    },
  },
  openSync(filePath: string, flags: string, mode: number): number {
    if (flags !== 'w') {
      throw new Error('myfs.open: it only supports "w", flag was: ' + flags);
    }
    //console.log('myfs.open', filePath, flags, mode)
    const file = { contents: [], mode };
    fileSystemMap.set(filePath, file);
    const fd = genFd();
    fileDescriptors.set(fd, { filePath });
    return fd;
  },
  readFileSync: (
    p: string | Buffer | URL | number,
    options?: { encoding: string | null; flag: string } | string,
  ) => {
    if (
      typeof p !== 'string' ||
      (options !== undefined && typeof options !== 'string')
    )
      throw new Error('myfs.readFile unsupported args');

    const file = fileSystemMap.get(p);
    if (!file) throw errorEnoent();

    if (options && isUtf8(options)) {
      if (file.contents.length === 0) {
        return '';
      } else if (file.contents.length === 1) {
        return new TextDecoder().decode(file.contents[0]);
      } else {
        throw new Error('unimplemented');
      }
    }

    return Buffer.from(file.contents);
  },
  writeSync(
    fd: number,
    buffer: Uint8Array,
    offset: number,
    length: number,
    position: unknown,
  ) {
    //console.log("naruwriteSync", { fd, buffer, offset, length, position })
    if (position !== null) {
      throw new Error('myfs.write: position is assumed to be null for now');
    }

    const fileDescriptor = fileDescriptors.get(fd);
    if (fileDescriptor === undefined) {
      throw new Error('fd not found');
    }
    const file = fileSystemMap.get(fileDescriptor.filePath);
    if (file === undefined) {
      throw new Error('file not found');
    }
    file.contents.push(buffer.subarray(offset, offset + length));
    //console.log('naruwrite', { fd, data: buffer.subarray(offset, offset + length) })
    return length;
  },
  chmod(...args) {
    console.log(args);
    throw new Error('myfs.chmod unimplmented');
  },
  rmdir(p: string, callback: () => void) {
    if (typeof callback !== 'function')
      throw new Error('myfs.rmdir unsupported variant');
    setImmediate(() => {
      callback();
    });
  },
  mkdir(p: string, options: unknown, callback: () => void) {
    if (typeof callback !== 'function')
      throw new Error('myfs.mkdir unsupported variant');
    setImmediate(() => {
      callback();
    });
  },
  writev(...args) {
    console.log(args);
    throw new Error('writev unsupported');
  },
  readdir(filePath: string, options, callback) {
    if (!callback) {
      throw new Error('unsupported');
    }
    console.log('narureaddir', filePath, options);
    const err = errorEnoent();
    setImmediate(() => {
      callback(err);
    });
  },
  readFile(...args) {
    console.log(args);
    throw new Error('readfile unimplemented');
  },
  open(
    filePath: string,
    flags: string,
    mode: number,
    callback: (err?: Error, fd: number) => void,
  ) {
    if (!callback) {
      throw new Error('myfs.open: only 4 args variant is implemented');
    }
    const fd = myfs.openSync(filePath, flags, mode);
    setImmediate(() => callback(undefined, fd));
  },
  write(
    fd: number,
    buffer: Uint8Array,
    offset: number,
    length: number,
    position: unknown,
    callback: () => void,
  ) {
    if (!callback) {
      throw new Error('myfs.write: only 6 args variant is implemented');
    }
    const bytesWritten = myfs.writeSync(fd, buffer, offset, length, position);
    const err = undefined;
    setImmediate(() => callback(err, bytesWritten, buffer));
  },
  closeSync(...args) {
    console.log('naruclosesync', args);
  },
  close(fd: number, callback?: (err?: Error) => void) {
    if (callback) {
      setImmediate(callback);
    }
  },
  stat(filePath: string, callback: Function) {
    myfs.promises.stat(filePath).then((val, err) => {
      setImmediate(() => {
        callback(err, val);
      });
    });
  },
  lstat(filePath: string, callback: Function) {
    myfs.promises.lstat(filePath).then((val, err) => {
      setImmediate(() => {
        callback(err, val);
      });
    });
  },
  promises: {
    async chmod(...args) {
      console.log(args);
      //throw new Error('myfs.promises.chmod unimplmented')
    },
    async open(...args) {
      return new Promise((resolve, reject) => {
        myfs.open(...args, (err, val) => {
          if (err) {
            reject(err);
          } else {
            resolve(val);
          }
        });
      });
    },
    stat: async (...args) => {
      if (args.length !== 1) throw new Error('for now it only supports 1 arg');
      console.log('myfs.promises.stat', args[0]);
      if (args[0].startsWith('/home/web/app/node_modules')) {
        return createFsStats();
      } else {
        throw errorEnoent();
      }
    },
    async readFile(...args) {
      return fs.readFileSync(...args);
    },
    async writeFile(...args) {
      console.log('writeFile', args);
    },
    async mkdir(...args) {
      console.log('mkdir', args);
    },
    async lstat(...args) {
      //console.log('lstat', args)
      return createFsStats();
    },
    async readlink(filePath: string, options: unknown) {
      console.log('narureadlink', filePath, options);
      return '../path/to/somewhere-by-myfs-readlink';
    },
    async rm(...args) {
      console.log('narurm', args);
    },
    async symlink(...args) {
      console.log('narusymlink', args);
    },
  },
};

//export const fs = proxy(memfs.fs)
export const fs = myfs;
