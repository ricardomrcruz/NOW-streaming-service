import { createHash } from "crypto";
import { RSC_MODULE_TYPES } from "../../../shared/lib/constants";
const imageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "avif",
    "ico",
    "svg"
];
const imageRegex = new RegExp(`\\.(${imageExtensions.join("|")})$`);
export function isClientComponentModule(mod) {
    var _mod_buildInfo_rsc;
    const hasClientDirective = ((_mod_buildInfo_rsc = mod.buildInfo.rsc) == null ? void 0 : _mod_buildInfo_rsc.type) === RSC_MODULE_TYPES.client;
    return hasClientDirective || imageRegex.test(mod.resource);
}
export const regexCSS = /\.(css|scss|sass)(\?.*)?$/;
// This function checks if a module is able to emit CSS resources. You should
// never only rely on a single regex to do that.
export function isCSSMod(mod) {
    var _mod_loaders;
    return !!(mod.type === "css/mini-extract" || mod.resource && regexCSS.test(mod.resource) || ((_mod_loaders = mod.loaders) == null ? void 0 : _mod_loaders.some(({ loader  })=>loader.includes("next-style-loader/index.js") || loader.includes("mini-css-extract-plugin/loader.js") || loader.includes("@vanilla-extract/webpack-plugin/loader/"))));
}
export function getActions(mod) {
    var _mod_buildInfo_rsc;
    return (_mod_buildInfo_rsc = mod.buildInfo.rsc) == null ? void 0 : _mod_buildInfo_rsc.actions;
}
export function generateActionId(filePath, exportName) {
    return createHash("sha1").update(filePath + ":" + exportName).digest("hex");
}

//# sourceMappingURL=utils.js.map