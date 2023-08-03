"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "_postPayload", {
    enumerable: true,
    get: function() {
        return _postPayload;
    }
});
const _asyncretry = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/async-retry"));
const _nodefetch = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/node-fetch"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _postPayload(endpoint, body, signal) {
    return (0, _asyncretry.default)(()=>(0, _nodefetch.default)(endpoint, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json"
            },
            timeout: 5000,
            signal
        }).then((res)=>{
            if (!res.ok) {
                const err = new Error(res.statusText);
                err.response = res;
                throw err;
            }
        }), {
        minTimeout: 500,
        retries: 1,
        factor: 1
    }).catch(()=>{
    // We swallow errors when telemetry cannot be sent
    })// Ensure promise is voided
    .then(()=>{}, ()=>{});
}

//# sourceMappingURL=post-payload.js.map