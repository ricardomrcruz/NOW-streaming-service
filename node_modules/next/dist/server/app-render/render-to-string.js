"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "renderToString", {
    enumerable: true,
    get: function() {
        return renderToString;
    }
});
const _react = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/react"));
const _serverbrowser = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/react-dom/server.browser"));
const _nodewebstreamshelper = require("../node-web-streams-helper");
const _constants = require("../lib/trace/constants");
const _tracer = require("../lib/trace/tracer");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function renderToString(element) {
    return (0, _tracer.getTracer)().trace(_constants.AppRenderSpan.renderToString, async ()=>{
        const renderStream = await _serverbrowser.default.renderToReadableStream(element);
        await renderStream.allReady;
        return (0, _nodewebstreamshelper.streamToString)(renderStream);
    });
}

//# sourceMappingURL=render-to-string.js.map