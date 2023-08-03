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
    getMetadataRouteSuffix: function() {
        return getMetadataRouteSuffix;
    },
    normalizeMetadataRoute: function() {
        return normalizeMetadataRoute;
    }
});
const _ismetadataroute = require("./is-metadata-route");
const _path = /*#__PURE__*/ _interop_require_default(require("../../shared/lib/isomorphic/path"));
const _hash = require("../../shared/lib/hash");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function getMetadataRouteSuffix(page) {
    let suffix = "";
    if (page.includes("(") && page.includes(")") || page.includes("@")) {
        suffix = (0, _hash.djb2Hash)(page).toString(36).slice(0, 6);
    }
    return suffix;
}
function normalizeMetadataRoute(page) {
    let route = page;
    if ((0, _ismetadataroute.isMetadataRoute)(page)) {
        // Remove the file extension, e.g. /route-path/robots.txt -> /route-path
        const pathnamePrefix = page.slice(0, -(_path.default.basename(page).length + 1));
        const suffix = getMetadataRouteSuffix(pathnamePrefix);
        if (route === "/sitemap") {
            route += ".xml";
        }
        if (route === "/robots") {
            route += ".txt";
        }
        if (route === "/manifest") {
            route += ".webmanifest";
        }
        // Support both /<metadata-route.ext> and custom routes /<metadata-route>/route.ts.
        // If it's a metadata file route, we need to append /[id]/route to the page.
        if (!route.endsWith("/route")) {
            const isStaticMetadataFile = (0, _ismetadataroute.isMetadataRouteFile)(route, [], true);
            const { dir , name: baseName , ext  } = _path.default.parse(route);
            const isSingleRoute = page.startsWith("/sitemap") || page.startsWith("/robots") || page.startsWith("/manifest") || isStaticMetadataFile;
            route = _path.default.join(dir, `${baseName}${suffix ? `-${suffix}` : ""}${ext}`, isSingleRoute ? "" : "[[...__metadata_id__]]", "route");
        }
    }
    return route;
}

//# sourceMappingURL=get-metadata-route.js.map