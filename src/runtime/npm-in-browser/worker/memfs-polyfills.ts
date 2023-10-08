import { Buffer } from 'nodejs-shim-pkg-buffer';
globalThis.process = { env: {} };
globalThis.Buffer = Buffer;
