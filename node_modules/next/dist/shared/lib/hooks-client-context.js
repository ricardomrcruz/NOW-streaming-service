"use client";
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
    SearchParamsContext: function() {
        return SearchParamsContext;
    },
    PathnameContext: function() {
        return PathnameContext;
    },
    ParamsContext: function() {
        return ParamsContext;
    },
    LayoutSegmentsContext: function() {
        return LayoutSegmentsContext;
    }
});
const _react = require("react");

const SearchParamsContext = (0, _react.createContext)(null);
const PathnameContext = (0, _react.createContext)(null);
const ParamsContext = (0, _react.createContext)(null);
const LayoutSegmentsContext = (0, _react.createContext)(null);
if (process.env.NODE_ENV !== 'production') {
    SearchParamsContext.displayName = 'SearchParamsContext';
    PathnameContext.displayName = 'PathnameContext';
    ParamsContext.displayName = 'ParamsContext';
    LayoutSegmentsContext.displayName = 'LayoutSegmentsContext';
}

//# sourceMappingURL=hooks-client-context.js.map