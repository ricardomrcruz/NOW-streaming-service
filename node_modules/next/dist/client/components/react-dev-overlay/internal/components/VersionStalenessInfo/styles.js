"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "styles", {
    enumerable: true,
    get: function() {
        return styles;
    }
});
const _nooptemplate = require("../../helpers/noop-template");
const styles = (0, _nooptemplate.noop)`
  .nextjs-container-build-error-version-status {
    flex: 1;
    text-align: right;
  }
  .nextjs-container-build-error-version-status small {
    margin-left: var(--size-gap);
    font-size: var(--size-font-small);
  }
  .nextjs-container-build-error-version-status a {
    font-size: var(--size-font-small);
  }
  .nextjs-container-build-error-version-status span {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background: var(--color-ansi-bright-black);
  }
  .nextjs-container-build-error-version-status span.fresh {
    background: var(--color-ansi-green);
  }
  .nextjs-container-build-error-version-status span.stale {
    background: var(--color-ansi-yellow);
  }
  .nextjs-container-build-error-version-status span.outdated {
    background: var(--color-ansi-red);
  }
`;

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=styles.js.map