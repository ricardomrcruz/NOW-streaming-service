"use client";

import { _ as _extends } from "@swc/helpers/_/_extends";
import React from 'react';
import { createSearchParamsBailoutProxy } from './searchparams-bailout-proxy';
export default function StaticGenerationSearchParamsBailoutProvider({ Component , propsForComponent  }) {
    const searchParams = createSearchParamsBailoutProxy();
    return /*#__PURE__*/ React.createElement(Component, _extends({
        searchParams: searchParams
    }, propsForComponent));
}

//# sourceMappingURL=static-generation-searchparams-bailout-provider.js.map