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
    ACTION_BUILD_OK: function() {
        return ACTION_BUILD_OK;
    },
    ACTION_BUILD_ERROR: function() {
        return ACTION_BUILD_ERROR;
    },
    ACTION_BEFORE_REFRESH: function() {
        return ACTION_BEFORE_REFRESH;
    },
    ACTION_REFRESH: function() {
        return ACTION_REFRESH;
    },
    ACTION_UNHANDLED_ERROR: function() {
        return ACTION_UNHANDLED_ERROR;
    },
    ACTION_UNHANDLED_REJECTION: function() {
        return ACTION_UNHANDLED_REJECTION;
    },
    ACTION_VERSION_INFO: function() {
        return ACTION_VERSION_INFO;
    },
    errorOverlayReducer: function() {
        return errorOverlayReducer;
    }
});
const _extends = require("@swc/helpers/_/_extends");
const ACTION_BUILD_OK = 'build-ok';
const ACTION_BUILD_ERROR = 'build-error';
const ACTION_BEFORE_REFRESH = 'before-fast-refresh';
const ACTION_REFRESH = 'fast-refresh';
const ACTION_UNHANDLED_ERROR = 'unhandled-error';
const ACTION_UNHANDLED_REJECTION = 'unhandled-rejection';
const ACTION_VERSION_INFO = 'version-info';
function pushErrorFilterDuplicates(errors, err) {
    return [
        ...errors.filter((e)=>{
            // Filter out duplicate errors
            return e.event.reason !== err.event.reason;
        }),
        err
    ];
}
const errorOverlayReducer = (state, action)=>{
    switch(action.type){
        case ACTION_BUILD_OK:
            {
                return _extends._({}, state, {
                    buildError: null
                });
            }
        case ACTION_BUILD_ERROR:
            {
                return _extends._({}, state, {
                    buildError: action.message
                });
            }
        case ACTION_BEFORE_REFRESH:
            {
                return _extends._({}, state, {
                    refreshState: {
                        type: 'pending',
                        errors: []
                    }
                });
            }
        case ACTION_REFRESH:
            {
                return _extends._({}, state, {
                    buildError: null,
                    errors: // Errors can come in during updates. In this case, UNHANDLED_ERROR
                    // and UNHANDLED_REJECTION events might be dispatched between the
                    // BEFORE_REFRESH and the REFRESH event. We want to keep those errors
                    // around until the next refresh. Otherwise we run into a race
                    // condition where those errors would be cleared on refresh completion
                    // before they can be displayed.
                    state.refreshState.type === 'pending' ? state.refreshState.errors : [],
                    refreshState: {
                        type: 'idle'
                    }
                });
            }
        case ACTION_UNHANDLED_ERROR:
        case ACTION_UNHANDLED_REJECTION:
            {
                switch(state.refreshState.type){
                    case 'idle':
                        {
                            return _extends._({}, state, {
                                nextId: state.nextId + 1,
                                errors: pushErrorFilterDuplicates(state.errors, {
                                    id: state.nextId,
                                    event: action
                                })
                            });
                        }
                    case 'pending':
                        {
                            return _extends._({}, state, {
                                nextId: state.nextId + 1,
                                refreshState: _extends._({}, state.refreshState, {
                                    errors: pushErrorFilterDuplicates(state.refreshState.errors, {
                                        id: state.nextId,
                                        event: action
                                    })
                                })
                            });
                        }
                    default:
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const _ = state.refreshState;
                        return state;
                }
            }
        case ACTION_VERSION_INFO:
            {
                return _extends._({}, state, {
                    versionInfo: action.versionInfo
                });
            }
        default:
            {
                return state;
            }
    }
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}

//# sourceMappingURL=error-overlay-reducer.js.map