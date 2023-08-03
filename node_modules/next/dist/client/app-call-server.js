"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "callServer", {
    enumerable: true,
    get: function() {
        return callServer;
    }
});
const _async_to_generator = require("@swc/helpers/_/_async_to_generator");
const _client = require("next/dist/compiled/react-server-dom-webpack/client");
function callServer(id, args) {
    return _callServer.apply(this, arguments);
}
function _callServer() {
    _callServer = _async_to_generator._(function*(id, args) {
        const actionId = id;
        // Fetching the current url with the action header.
        // TODO: Refactor this to look up from a manifest.
        const res = yield fetch('', {
            method: 'POST',
            headers: {
                Accept: 'text/x-component',
                'Next-Action': actionId
            },
            body: yield (0, _client.encodeReply)(args)
        });
        if (!res.ok) {
            throw new Error((yield res.text()));
        }
        return (yield res.json())[0];
    });
    return _callServer.apply(this, arguments);
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=app-call-server.js.map