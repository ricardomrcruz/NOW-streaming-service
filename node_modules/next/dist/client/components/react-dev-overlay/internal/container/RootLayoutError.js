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
    RootLayoutError: function() {
        return RootLayoutError;
    },
    styles: function() {
        return styles;
    }
});
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _react = /*#__PURE__*/ _interop_require_default._(require("react"));
const _Dialog = require("../components/Dialog");
const _Overlay = require("../components/Overlay");
const _Terminal = require("../components/Terminal");
const _nooptemplate = require("../helpers/noop-template");
const RootLayoutError = function BuildError({ missingTags  }) {
    const message = 'Please make sure to include the following tags in your root layout: <html>, <body>.\n\n' + `Missing required root layout tag${missingTags.length === 1 ? '' : 's'}: ` + missingTags.join(', ');
    const noop = _react.default.useCallback(()=>{}, []);
    return /*#__PURE__*/ _react.default.createElement(_Overlay.Overlay, {
        fixed: true
    }, /*#__PURE__*/ _react.default.createElement(_Dialog.Dialog, {
        type: "error",
        "aria-labelledby": "nextjs__container_root_layout_error_label",
        "aria-describedby": "nextjs__container_root_layout_error_desc",
        onClose: noop
    }, /*#__PURE__*/ _react.default.createElement(_Dialog.DialogContent, null, /*#__PURE__*/ _react.default.createElement(_Dialog.DialogHeader, {
        className: "nextjs-container-root-layout-error-header"
    }, /*#__PURE__*/ _react.default.createElement("h4", {
        id: "nextjs__container_root_layout_error_label"
    }, "Missing required tags")), /*#__PURE__*/ _react.default.createElement(_Dialog.DialogBody, {
        className: "nextjs-container-root-layout-error-body"
    }, /*#__PURE__*/ _react.default.createElement(_Terminal.Terminal, {
        content: message
    }), /*#__PURE__*/ _react.default.createElement("footer", null, /*#__PURE__*/ _react.default.createElement("p", {
        id: "nextjs__container_root_layout_error_desc"
    }, /*#__PURE__*/ _react.default.createElement("small", null, "This error and can only be dismissed by providing all required tags.")))))));
};
const styles = (0, _nooptemplate.noop)`
  .nextjs-container-root-layout-error-header > h4 {
    line-height: 1.5;
    margin: 0;
    padding: 0;
  }

  .nextjs-container-root-layout-error-body footer {
    margin-top: var(--size-gap);
  }
  .nextjs-container-root-layout-error-body footer p {
    margin: 0;
  }

  .nextjs-container-root-layout-error-body small {
    color: #757575;
  }
`;

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=RootLayoutError.js.map