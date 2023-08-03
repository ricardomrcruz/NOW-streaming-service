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
    BuildError: function() {
        return BuildError;
    },
    styles: function() {
        return styles;
    }
});
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _react = /*#__PURE__*/ _interop_require_wildcard._(require("react"));
const _Dialog = require("../components/Dialog");
const _Overlay = require("../components/Overlay");
const _Terminal = require("../components/Terminal");
const _VersionStalenessInfo = require("../components/VersionStalenessInfo");
const _nooptemplate = require("../helpers/noop-template");
const BuildError = function BuildError({ message , versionInfo  }) {
    const noop = _react.useCallback(()=>{}, []);
    return /*#__PURE__*/ _react.createElement(_Overlay.Overlay, {
        fixed: true
    }, /*#__PURE__*/ _react.createElement(_Dialog.Dialog, {
        type: "error",
        "aria-labelledby": "nextjs__container_build_error_label",
        "aria-describedby": "nextjs__container_build_error_desc",
        onClose: noop
    }, /*#__PURE__*/ _react.createElement(_Dialog.DialogContent, null, /*#__PURE__*/ _react.createElement(_Dialog.DialogHeader, {
        className: "nextjs-container-build-error-header"
    }, /*#__PURE__*/ _react.createElement("h4", {
        id: "nextjs__container_build_error_label"
    }, "Failed to compile"), versionInfo ? /*#__PURE__*/ _react.createElement(_VersionStalenessInfo.VersionStalenessInfo, versionInfo) : null), /*#__PURE__*/ _react.createElement(_Dialog.DialogBody, {
        className: "nextjs-container-build-error-body"
    }, /*#__PURE__*/ _react.createElement(_Terminal.Terminal, {
        content: message
    }), /*#__PURE__*/ _react.createElement("footer", null, /*#__PURE__*/ _react.createElement("p", {
        id: "nextjs__container_build_error_desc"
    }, /*#__PURE__*/ _react.createElement("small", null, "This error occurred during the build process and can only be dismissed by fixing the error.")))))));
};
const styles = (0, _nooptemplate.noop)`
  .nextjs-container-build-error-header {
    display: flex;
    align-items: center;
  }
  .nextjs-container-build-error-header > h4 {
    line-height: 1.5;
    margin: 0;
    padding: 0;
  }

  .nextjs-container-build-error-body footer {
    margin-top: var(--size-gap);
  }
  .nextjs-container-build-error-body footer p {
    margin: 0;
  }

  .nextjs-container-build-error-body small {
    color: #757575;
  }
`;

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=BuildError.js.map