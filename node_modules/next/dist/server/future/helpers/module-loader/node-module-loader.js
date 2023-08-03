"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NodeModuleLoader", {
    enumerable: true,
    get: function() {
        return NodeModuleLoader;
    }
});
class NodeModuleLoader {
    load(id) {
        if (process.env.NEXT_RUNTIME !== "edge") {
            return require(id);
        }
        throw new Error("NodeModuleLoader is not supported in edge runtime.");
    }
}

//# sourceMappingURL=node-module-loader.js.map