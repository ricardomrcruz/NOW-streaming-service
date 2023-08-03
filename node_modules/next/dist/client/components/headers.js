"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    headers: function() {
        return headers;
    },
    previewData: function() {
        return previewData;
    },
    cookies: function() {
        return cookies;
    }
});
const _requestcookies = require("../../server/web/spec-extension/adapters/request-cookies");
const _headers = require("../../server/web/spec-extension/adapters/headers");
const _cookies = require("../../server/web/spec-extension/cookies");
const _requestasyncstorage = require("./request-async-storage");
const _staticgenerationbailout = require("./static-generation-bailout");
function headers() {
    if ((0, _staticgenerationbailout.staticGenerationBailout)('headers')) {
        return _headers.HeadersAdapter.seal(new Headers({}));
    }
    const requestStore = _requestasyncstorage.requestAsyncStorage.getStore();
    if (!requestStore) {
        throw new Error(`Invariant: Method expects to have requestAsyncStorage, none available`);
    }
    return requestStore.headers;
}
function previewData() {
    const requestStore = _requestasyncstorage.requestAsyncStorage.getStore();
    if (!requestStore) {
        throw new Error(`Invariant: Method expects to have requestAsyncStorage, none available`);
    }
    return requestStore.previewData;
}
function cookies() {
    if ((0, _staticgenerationbailout.staticGenerationBailout)('cookies')) {
        return _requestcookies.RequestCookiesAdapter.seal(new _cookies.RequestCookies(new Headers({})));
    }
    const requestStore = _requestasyncstorage.requestAsyncStorage.getStore();
    if (!requestStore) {
        throw new Error(`Invariant: Method expects to have requestAsyncStorage, none available`);
    }
    return requestStore.cookies;
}

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=headers.js.map