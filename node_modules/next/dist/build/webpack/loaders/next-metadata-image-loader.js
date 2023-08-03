/*
 * This loader is responsible for extracting the metadata image info for rendering in html
 */ "use strict";
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
    raw: function() {
        return raw;
    },
    default: function() {
        return _default;
    }
});
const _promises = /*#__PURE__*/ _interop_require_default(require("fs/promises"));
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _loaderutils3 = /*#__PURE__*/ _interop_require_default(require("next/dist/compiled/loader-utils3"));
const _imageoptimizer = require("../../../server/image-optimizer");
const _mimetype = require("../../../lib/mime-type");
const _fileexists = require("../../../lib/file-exists");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function nextMetadataImageLoader(content) {
    const options = this.getOptions();
    const { type , route , segment , pageExtensions  } = options;
    const numericSizes = type === "twitter" || type === "openGraph";
    const { resourcePath , rootContext: context  } = this;
    const { name: fileNameBase , ext  } = _path.default.parse(resourcePath);
    let extension = ext.slice(1);
    if (extension === "jpg") {
        extension = "jpeg";
    }
    const opts = {
        context,
        content
    };
    // No hash query for favicon.ico
    const contentHash = type === "favicon" ? "" : _loaderutils3.default.interpolateName(this, "[contenthash]", opts);
    const interpolatedName = _loaderutils3.default.interpolateName(this, "[name].[ext]", opts);
    const isDynamicResource = pageExtensions.includes(extension);
    const pageRoute = isDynamicResource ? fileNameBase : interpolatedName;
    const hashQuery = contentHash ? "?" + contentHash : "";
    if (isDynamicResource) {
        // re-export and spread as `exportedImageData` to avoid non-exported error
        return `\
    import path from 'next/dist/shared/lib/isomorphic/path'
    import * as exported from ${JSON.stringify(resourcePath)}
    import { interpolateDynamicPath } from 'next/dist/server/server-utils'
    import { getNamedRouteRegex } from 'next/dist/shared/lib/router/utils/route-regex'
    import { getMetadataRouteSuffix } from 'next/dist/lib/metadata/get-metadata-route'

    const imageModule = { ...exported }
    export default async function (props) {
      const pathname = ${JSON.stringify(route)}
      const routeRegex = getNamedRouteRegex(pathname, false)
      const segment = ${JSON.stringify(segment)}
      const { __metadata_id__: _, ...params } = props.params
      const route = interpolateDynamicPath(pathname, params, routeRegex)
      const suffix = getMetadataRouteSuffix(segment)
      const routeSuffix = suffix ? \`-\${suffix}\` : ''
      const imageRoute = ${JSON.stringify(pageRoute)} + routeSuffix

      const { generateImageMetadata } = imageModule

      function getImageMetadata(imageMetadata, segment) {
        const data = {
          alt: imageMetadata.alt,
          type: imageMetadata.contentType || 'image/png',
          url: path.join(route, segment + ${JSON.stringify(hashQuery)}),
        }
        const { size } = imageMetadata
        if (size) {
          ${type === "twitter" || type === "openGraph" ? "data.width = size.width; data.height = size.height;" : 'data.sizes = size.width + "x" + size.height;'}
        }
        return data
      }

      if (generateImageMetadata) {
        const imageMetadataArray = await generateImageMetadata({ params })
        return imageMetadataArray.map((imageMetadata, index) => {
          const segment = path.join(imageRoute, (imageMetadata.id || index) + '')
          return getImageMetadata(imageMetadata, segment)
        })
      } else {
        return [getImageMetadata(imageModule, imageRoute)]
      }
    }`;
    }
    const imageSize = await (0, _imageoptimizer.getImageSize)(content, extension).catch((err)=>err);
    if (imageSize instanceof Error) {
        const err = imageSize;
        err.name = "InvalidImageFormatError";
        throw err;
    }
    const imageData = {
        ...extension in _mimetype.imageExtMimeTypeMap && {
            type: _mimetype.imageExtMimeTypeMap[extension]
        },
        ...numericSizes ? {
            width: imageSize.width,
            height: imageSize.height
        } : {
            sizes: extension === "ico" ? "any" : `${imageSize.width}x${imageSize.height}`
        }
    };
    if (type === "openGraph" || type === "twitter") {
        const altPath = _path.default.join(_path.default.dirname(resourcePath), fileNameBase + ".alt.txt");
        if (await (0, _fileexists.fileExists)(altPath)) {
            imageData.alt = await _promises.default.readFile(altPath, "utf8");
        }
    }
    return `\
  import path from 'next/dist/shared/lib/isomorphic/path'
  import { interpolateDynamicPath } from 'next/dist/server/server-utils'
  import { getNamedRouteRegex } from 'next/dist/shared/lib/router/utils/route-regex'
  import { getMetadataRouteSuffix } from 'next/dist/lib/metadata/get-metadata-route'

  export default (props) => {
    const pathname = ${JSON.stringify(route)}
    const routeRegex = getNamedRouteRegex(pathname, false)
    const segment = ${JSON.stringify(segment)}
    const route = interpolateDynamicPath(pathname, props.params, routeRegex)
    const suffix = getMetadataRouteSuffix(segment)
    const routeSuffix = suffix ? \`-\${suffix}\` : ''
    const { name, ext } = path.parse(${JSON.stringify(pageRoute)})

    const imageData = ${JSON.stringify(imageData)};

    return [{
      ...imageData,
      url: path.join(route, name + routeSuffix + ext + ${JSON.stringify(type === "favicon" ? "" : hashQuery)}),
    }]
  }`;
}
const raw = true;
const _default = nextMetadataImageLoader;

//# sourceMappingURL=next-metadata-image-loader.js.map