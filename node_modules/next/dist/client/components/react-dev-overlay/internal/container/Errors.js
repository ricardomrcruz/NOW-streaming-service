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
    Errors: function() {
        return Errors;
    },
    styles: function() {
        return styles;
    }
});
const _extends = require("@swc/helpers/_/_extends");
const _interop_require_wildcard = require("@swc/helpers/_/_interop_require_wildcard");
const _react = /*#__PURE__*/ _interop_require_wildcard._(require("react"));
const _erroroverlayreducer = require("../error-overlay-reducer");
const _Dialog = require("../components/Dialog");
const _LeftRightDialogHeader = require("../components/LeftRightDialogHeader");
const _Overlay = require("../components/Overlay");
const _Toast = require("../components/Toast");
const _getErrorByType = require("../helpers/getErrorByType");
const _nodeStackFrames = require("../helpers/nodeStackFrames");
const _nooptemplate = require("../helpers/noop-template");
const _CloseIcon = require("../icons/CloseIcon");
const _RuntimeError = require("./RuntimeError");
const _VersionStalenessInfo = require("../components/VersionStalenessInfo");
const _hotlinkedtext = require("../components/hot-linked-text");
function getErrorSignature(ev) {
    const { event  } = ev;
    switch(event.type){
        case _erroroverlayreducer.ACTION_UNHANDLED_ERROR:
        case _erroroverlayreducer.ACTION_UNHANDLED_REJECTION:
            {
                return `${event.reason.name}::${event.reason.message}::${event.reason.stack}`;
            }
        default:
            {}
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = event;
    return '';
}
const Errors = function Errors({ errors , initialDisplayState , versionInfo  }) {
    const [lookups, setLookups] = _react.useState({});
    const [readyErrors, nextError] = _react.useMemo(()=>{
        let ready = [];
        let next = null;
        // Ensure errors are displayed in the order they occurred in:
        for(let idx = 0; idx < errors.length; ++idx){
            const e = errors[idx];
            const { id  } = e;
            if (id in lookups) {
                ready.push(lookups[id]);
                continue;
            }
            // Check for duplicate errors
            if (idx > 0) {
                const prev = errors[idx - 1];
                if (getErrorSignature(prev) === getErrorSignature(e)) {
                    continue;
                }
            }
            next = e;
            break;
        }
        return [
            ready,
            next
        ];
    }, [
        errors,
        lookups
    ]);
    const isLoading = _react.useMemo(()=>{
        return readyErrors.length < 1 && Boolean(errors.length);
    }, [
        errors.length,
        readyErrors.length
    ]);
    _react.useEffect(()=>{
        if (nextError == null) {
            return;
        }
        let mounted = true;
        (0, _getErrorByType.getErrorByType)(nextError).then((resolved)=>{
            // We don't care if the desired error changed while we were resolving,
            // thus we're not tracking it using a ref. Once the work has been done,
            // we'll store it.
            if (mounted) {
                setLookups((m)=>_extends._({}, m, {
                        [resolved.id]: resolved
                    }));
            }
        }, ()=>{
        // TODO: handle this, though an edge case
        });
        return ()=>{
            mounted = false;
        };
    }, [
        nextError
    ]);
    const [displayState, setDisplayState] = _react.useState(initialDisplayState);
    const [activeIdx, setActiveIndex] = _react.useState(0);
    const previous = _react.useCallback((e)=>{
        e == null ? void 0 : e.preventDefault();
        setActiveIndex((v)=>Math.max(0, v - 1));
    }, []);
    const next = _react.useCallback((e)=>{
        e == null ? void 0 : e.preventDefault();
        setActiveIndex((v)=>Math.max(0, Math.min(readyErrors.length - 1, v + 1)));
    }, [
        readyErrors.length
    ]);
    var _readyErrors_activeIdx;
    const activeError = _react.useMemo(()=>(_readyErrors_activeIdx = readyErrors[activeIdx]) != null ? _readyErrors_activeIdx : null, [
        activeIdx,
        readyErrors
    ]);
    // Reset component state when there are no errors to be displayed.
    // This should never happen, but lets handle it.
    _react.useEffect(()=>{
        if (errors.length < 1) {
            setLookups({});
            setDisplayState('hidden');
            setActiveIndex(0);
        }
    }, [
        errors.length
    ]);
    const minimize = _react.useCallback((e)=>{
        e == null ? void 0 : e.preventDefault();
        setDisplayState('minimized');
    }, []);
    const hide = _react.useCallback((e)=>{
        e == null ? void 0 : e.preventDefault();
        setDisplayState('hidden');
    }, []);
    const fullscreen = _react.useCallback((e)=>{
        e == null ? void 0 : e.preventDefault();
        setDisplayState('fullscreen');
    }, []);
    // This component shouldn't be rendered with no errors, but if it is, let's
    // handle it gracefully by rendering nothing.
    if (errors.length < 1 || activeError == null) {
        return null;
    }
    if (isLoading) {
        // TODO: better loading state
        return /*#__PURE__*/ _react.createElement(_Overlay.Overlay, null);
    }
    if (displayState === 'hidden') {
        return null;
    }
    if (displayState === 'minimized') {
        return /*#__PURE__*/ _react.createElement(_Toast.Toast, {
            className: "nextjs-toast-errors-parent",
            onClick: fullscreen
        }, /*#__PURE__*/ _react.createElement("div", {
            className: "nextjs-toast-errors"
        }, /*#__PURE__*/ _react.createElement("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, /*#__PURE__*/ _react.createElement("circle", {
            cx: "12",
            cy: "12",
            r: "10"
        }), /*#__PURE__*/ _react.createElement("line", {
            x1: "12",
            y1: "8",
            x2: "12",
            y2: "12"
        }), /*#__PURE__*/ _react.createElement("line", {
            x1: "12",
            y1: "16",
            x2: "12.01",
            y2: "16"
        })), /*#__PURE__*/ _react.createElement("span", null, readyErrors.length, " error", readyErrors.length > 1 ? 's' : ''), /*#__PURE__*/ _react.createElement("button", {
            "data-nextjs-toast-errors-hide-button": true,
            className: "nextjs-toast-errors-hide-button",
            type: "button",
            onClick: (e)=>{
                e.stopPropagation();
                hide();
            },
            "aria-label": "Hide Errors"
        }, /*#__PURE__*/ _react.createElement(_CloseIcon.CloseIcon, null))));
    }
    const isServerError = [
        'server',
        'edge-server'
    ].includes((0, _nodeStackFrames.getErrorSource)(activeError.error) || '');
    return /*#__PURE__*/ _react.createElement(_Overlay.Overlay, null, /*#__PURE__*/ _react.createElement(_Dialog.Dialog, {
        type: "error",
        "aria-labelledby": "nextjs__container_errors_label",
        "aria-describedby": "nextjs__container_errors_desc",
        onClose: isServerError ? undefined : minimize
    }, /*#__PURE__*/ _react.createElement(_Dialog.DialogContent, null, /*#__PURE__*/ _react.createElement(_Dialog.DialogHeader, {
        className: "nextjs-container-errors-header"
    }, /*#__PURE__*/ _react.createElement(_LeftRightDialogHeader.LeftRightDialogHeader, {
        previous: activeIdx > 0 ? previous : null,
        next: activeIdx < readyErrors.length - 1 ? next : null,
        close: isServerError ? undefined : minimize
    }, /*#__PURE__*/ _react.createElement("small", null, /*#__PURE__*/ _react.createElement("span", null, activeIdx + 1), " of", ' ', /*#__PURE__*/ _react.createElement("span", null, readyErrors.length), " unhandled error", readyErrors.length < 2 ? '' : 's'), versionInfo ? /*#__PURE__*/ _react.createElement(_VersionStalenessInfo.VersionStalenessInfo, versionInfo) : null), /*#__PURE__*/ _react.createElement("h1", {
        id: "nextjs__container_errors_label"
    }, isServerError ? 'Server Error' : 'Unhandled Runtime Error'), /*#__PURE__*/ _react.createElement("p", {
        id: "nextjs__container_errors_desc"
    }, activeError.error.name, ":", ' ', /*#__PURE__*/ _react.createElement(_hotlinkedtext.HotlinkedText, {
        text: activeError.error.message
    })), isServerError ? /*#__PURE__*/ _react.createElement("div", null, /*#__PURE__*/ _react.createElement("small", null, "This error happened while generating the page. Any console logs will be displayed in the terminal window.")) : undefined), /*#__PURE__*/ _react.createElement(_Dialog.DialogBody, {
        className: "nextjs-container-errors-body"
    }, /*#__PURE__*/ _react.createElement(_RuntimeError.RuntimeError, {
        key: activeError.id.toString(),
        error: activeError
    })))));
};
const styles = (0, _nooptemplate.noop)`
  .nextjs-container-errors-header > h1 {
    font-size: var(--size-font-big);
    line-height: var(--size-font-bigger);
    font-weight: bold;
    margin: 0;
    margin-top: calc(var(--size-gap-double) + var(--size-gap-half));
  }
  .nextjs-container-errors-header small {
    font-size: var(--size-font-small);
    color: var(--color-accents-1);
    margin-left: var(--size-gap-double);
  }
  .nextjs-container-errors-header small > span {
    font-family: var(--font-stack-monospace);
  }
  .nextjs-container-errors-header > p {
    font-family: var(--font-stack-monospace);
    font-size: var(--size-font-small);
    line-height: var(--size-font-big);
    font-weight: bold;
    margin: 0;
    margin-top: var(--size-gap-half);
    color: var(--color-ansi-red);
    white-space: pre-wrap;
  }
  .nextjs-container-errors-header > div > small {
    margin: 0;
    margin-top: var(--size-gap-half);
  }
  .nextjs-container-errors-header > p > a {
    color: var(--color-ansi-red);
  }

  .nextjs-container-errors-body > h5:not(:first-child) {
    margin-top: calc(var(--size-gap-double) + var(--size-gap));
  }
  .nextjs-container-errors-body > h5 {
    margin-bottom: var(--size-gap);
  }

  .nextjs-toast-errors-parent {
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  .nextjs-toast-errors-parent:hover {
    transform: scale(1.1);
  }
  .nextjs-toast-errors {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .nextjs-toast-errors > svg {
    margin-right: var(--size-gap);
  }
  .nextjs-toast-errors-hide-button {
    margin-left: var(--size-gap-triple);
    border: none;
    background: none;
    color: var(--color-ansi-bright-white);
    padding: 0;
    transition: opacity 0.25s ease;
    opacity: 0.7;
  }
  .nextjs-toast-errors-hide-button:hover {
    opacity: 1;
  }
`;

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=Errors.js.map