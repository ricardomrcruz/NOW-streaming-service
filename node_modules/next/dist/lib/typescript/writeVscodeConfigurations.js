"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "writeVscodeConfigurations", {
    enumerable: true,
    get: function() {
        return writeVscodeConfigurations;
    }
});
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _iserror = /*#__PURE__*/ _interop_require_default(require("../is-error"));
const _fs = require("fs");
const _log = /*#__PURE__*/ _interop_require_wildcard(require("../../build/output/log"));
const _commentjson = /*#__PURE__*/ _interop_require_wildcard(require("next/dist/compiled/comment-json"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
async function writeVscodeConfigurations(baseDir, tsPath) {
    try {
        const vscodeSettings = _path.default.join(baseDir, ".vscode", "settings.json");
        let settings = {};
        let configExists = false;
        let currentContent = "";
        try {
            currentContent = await _fs.promises.readFile(vscodeSettings, "utf8");
            settings = _commentjson.parse(currentContent);
            configExists = true;
        } catch (err) {
            if ((0, _iserror.default)(err) && err.code !== "ENOENT") {
                throw err;
            }
        }
        if (settings["typescript.tsdk"] && settings["typescript.enablePromptUseWorkspaceTsdk"]) {
            return;
        }
        const libPath = _path.default.relative(baseDir, _path.default.dirname(tsPath));
        settings["typescript.tsdk"] = libPath;
        settings["typescript.enablePromptUseWorkspaceTsdk"] = true;
        const content = _commentjson.stringify(settings, null, 2);
        const vscodeFolder = _path.default.join(baseDir, ".vscode");
        try {
            await _fs.promises.lstat(vscodeFolder);
        } catch (e) {
            await _fs.promises.mkdir(vscodeFolder, {
                recursive: true
            });
        }
        await _fs.promises.writeFile(vscodeSettings, content);
        _log.info(`VS Code settings.json has been ${configExists ? "updated" : "created"} for Next.js' automatic app types, this file can be added to .gitignore if desired`);
    } catch (err) {
        _log.error(`Failed to apply custom vscode config for Next.js' app types`, err);
    }
}

//# sourceMappingURL=writeVscodeConfigurations.js.map