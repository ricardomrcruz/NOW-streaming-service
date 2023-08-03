"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ActionRenderResult", {
    enumerable: true,
    get: function() {
        return ActionRenderResult;
    }
});
const _renderresult = /*#__PURE__*/ _interop_require_default(require("../render-result"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class ActionRenderResult extends _renderresult.default {
    constructor(response){
        super(response, {
            contentType: "application/json"
        });
    }
}

//# sourceMappingURL=action-render-result.js.map