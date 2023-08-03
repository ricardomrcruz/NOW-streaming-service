"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _streams = require("next/dist/compiled/@edge-runtime/primitives/streams");
// Polyfill Web Streams for the Node.js runtime.
if (!global.ReadableStream) {
    global.ReadableStream = _streams.ReadableStream;
}
if (!global.TransformStream) {
    global.TransformStream = _streams.TransformStream;
}

//# sourceMappingURL=node-polyfill-web-streams.js.map