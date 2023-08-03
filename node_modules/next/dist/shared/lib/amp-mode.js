"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isInAmpMode", {
    enumerable: true,
    get: function() {
        return isInAmpMode;
    }
});
function isInAmpMode({ ampFirst =false , hybrid =false , hasQuery =false  } = {}) {
    return ampFirst || hybrid && hasQuery;
}

//# sourceMappingURL=amp-mode.js.map