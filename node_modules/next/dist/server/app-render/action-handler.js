"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "handleAction", {
    enumerable: true,
    get: function() {
        return handleAction;
    }
});
const _approuterheaders = require("../../client/components/app-router-headers");
const _notfound = require("../../client/components/not-found");
const _redirect = require("../../client/components/redirect");
const _renderresult = /*#__PURE__*/ _interop_require_default(require("../render-result"));
const _actionrenderresult = require("./action-render-result");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function handleAction({ req , res , ComponentMod , pathname , serverActionsManifest  }) {
    let actionId = req.headers[_approuterheaders.ACTION.toLowerCase()];
    const contentType = req.headers["content-type"];
    const isFormAction = req.method === "POST" && contentType === "application/x-www-form-urlencoded";
    const isMultipartAction = req.method === "POST" && (contentType == null ? void 0 : contentType.startsWith("multipart/form-data"));
    const isFetchAction = actionId !== undefined && typeof actionId === "string" && req.method === "POST";
    if (isFetchAction || isFormAction || isMultipartAction) {
        let bound = [];
        const workerName = "app" + pathname;
        const { decodeReply  } = ComponentMod;
        try {
            if (process.env.NEXT_RUNTIME === "edge") {
                const webRequest = req;
                if (!webRequest.body) {
                    throw new Error("invariant: Missing request body.");
                }
                if (isMultipartAction) {
                    throw new Error("invariant: Multipart form data is not supported.");
                } else {
                    let actionData = "";
                    const reader = webRequest.body.getReader();
                    while(true){
                        const { done , value  } = await reader.read();
                        if (done) {
                            break;
                        }
                        actionData += new TextDecoder().decode(value);
                    }
                    if (isFormAction) {
                        const formData = new URLSearchParams(actionData);
                        actionId = formData.get("$$id");
                        if (!actionId) {
                            throw new Error("Invariant: missing action ID.");
                        }
                        formData.delete("$$id");
                        bound = [
                            formData
                        ];
                    } else {
                        bound = await decodeReply(actionData);
                    }
                }
            } else {
                if (isMultipartAction) {
                    const formFields = new FormData();
                    const busboy = require("busboy");
                    const bb = busboy({
                        headers: req.headers
                    });
                    let innerResolvor, innerRejector;
                    const promise = new Promise((resolve, reject)=>{
                        innerResolvor = resolve;
                        innerRejector = reject;
                    });
                    bb.on("file", ()=>innerRejector(new Error("File upload is not supported.")));
                    bb.on("error", (err)=>innerRejector(err));
                    bb.on("field", (id, val)=>formFields.append(id, val));
                    bb.on("finish", ()=>innerResolvor());
                    req.pipe(bb);
                    await promise;
                    bound = await decodeReply(formFields, new Proxy({}, {
                        get: (_, id)=>{
                            return {
                                id: serverActionsManifest.node[id].workers[workerName],
                                name: id,
                                chunks: []
                            };
                        }
                    }));
                } else {
                    const { parseBody  } = require("../api-utils/node");
                    const actionData = await parseBody(req, "1mb") || "";
                    if (isFormAction) {
                        actionId = actionData.$$id;
                        if (!actionId) {
                            throw new Error("Invariant: missing action ID.");
                        }
                        const formData = new URLSearchParams(actionData);
                        formData.delete("$$id");
                        bound = [
                            formData
                        ];
                    } else {
                        bound = await decodeReply(actionData);
                    }
                }
            }
            const actionModId = serverActionsManifest[process.env.NEXT_RUNTIME === "edge" ? "edge" : "node"][actionId].workers[workerName];
            const actionHandler = ComponentMod.__next_app_webpack_require__(actionModId)[actionId];
            const returnVal = await actionHandler.apply(null, bound);
            const result = new _actionrenderresult.ActionRenderResult(JSON.stringify([
                returnVal
            ]));
            // For form actions, we need to continue rendering the page.
            if (isFetchAction) {
                return result;
            }
        } catch (err) {
            if ((0, _redirect.isRedirectError)(err)) {
                if (isFetchAction || process.env.NEXT_RUNTIME === "edge") {
                    throw new Error("Invariant: not implemented.");
                }
                const redirectUrl = (0, _redirect.getURLFromRedirectError)(err);
                res.statusCode = 303;
                res.setHeader("Location", redirectUrl);
                return new _actionrenderresult.ActionRenderResult(JSON.stringify({}));
            } else if ((0, _notfound.isNotFoundError)(err)) {
                if (isFetchAction) {
                    throw new Error("Invariant: not implemented.");
                }
                res.statusCode = 404;
                return "not-found";
            }
            if (isFetchAction) {
                res.statusCode = 500;
                return new _renderresult.default((err == null ? void 0 : err.message) ?? "Internal Server Error");
            }
            throw err;
        }
    }
}

//# sourceMappingURL=action-handler.js.map