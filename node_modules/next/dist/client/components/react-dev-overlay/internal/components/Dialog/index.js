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
    Dialog: function() {
        return _Dialog.Dialog;
    },
    DialogBody: function() {
        return _DialogBody.DialogBody;
    },
    DialogContent: function() {
        return _DialogContent.DialogContent;
    },
    DialogHeader: function() {
        return _DialogHeader.DialogHeader;
    },
    styles: function() {
        return _styles.styles;
    }
});
const _Dialog = require("./Dialog");
const _DialogBody = require("./DialogBody");
const _DialogContent = require("./DialogContent");
const _DialogHeader = require("./DialogHeader");
const _styles = require("./styles");

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=index.js.map