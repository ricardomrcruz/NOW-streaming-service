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
    handleTemporaryRedirectResponse: function() {
        return handleTemporaryRedirectResponse;
    },
    handleBadRequestResponse: function() {
        return handleBadRequestResponse;
    },
    handleNotFoundResponse: function() {
        return handleNotFoundResponse;
    },
    handleMethodNotAllowedResponse: function() {
        return handleMethodNotAllowedResponse;
    },
    handleInternalServerErrorResponse: function() {
        return handleInternalServerErrorResponse;
    }
});
function handleTemporaryRedirectResponse(url) {
    return new Response(null, {
        status: 302,
        statusText: "Found",
        headers: {
            location: url
        }
    });
}
function handleBadRequestResponse() {
    return new Response(null, {
        status: 400,
        statusText: "Bad Request"
    });
}
function handleNotFoundResponse() {
    return new Response(null, {
        status: 404,
        statusText: "Not Found"
    });
}
function handleMethodNotAllowedResponse() {
    return new Response(null, {
        status: 405,
        statusText: "Method Not Allowed"
    });
}
function handleInternalServerErrorResponse() {
    return new Response(null, {
        status: 500,
        statusText: "Internal Server Error"
    });
}

//# sourceMappingURL=response-handlers.js.map