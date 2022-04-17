// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"8wcER":[function(require,module,exports) {
"use strict";
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "5c1b77e3b71e74eb";
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it) o = it;
            var i = 0;
            var F = function F() {};
            return {
                s: F,
                n: function n() {
                    if (i >= o.length) return {
                        done: true
                    };
                    return {
                        done: false,
                        value: o[i++]
                    };
                },
                e: function e(_e) {
                    throw _e;
                },
                f: F
            };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return {
        s: function s() {
            it = it.call(o);
        },
        n: function n() {
            var step = it.next();
            normalCompletion = step.done;
            return step;
        },
        e: function e(_e2) {
            didErr = true;
            err = _e2;
        },
        f: function f() {
            try {
                if (!normalCompletion && it.return != null) it.return();
            } finally{
                if (didErr) throw err;
            }
        }
    };
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: mixed;
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function accept(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function dispose(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets, acceptedAssets, assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == 'https:' && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? 'wss' : 'ws';
    var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/'); // $FlowFixMe
    ws.onmessage = function(event) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        acceptedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        var data = JSON.parse(event.data);
        if (data.type === 'update') {
            // Remove error overlay if there is one
            if (typeof document !== 'undefined') removeErrorOverlay();
            var assets = data.assets.filter(function(asset) {
                return asset.envHash === HMR_ENV_HASH;
            }); // Handle HMR Update
            var handled = assets.every(function(asset) {
                return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                assets.forEach(function(asset) {
                    hmrApply(module.bundle.root, asset);
                });
                for(var i = 0; i < assetsToAccept.length; i++){
                    var id = assetsToAccept[i][1];
                    if (!acceptedAssets[id]) hmrAcceptRun(assetsToAccept[i][0], id);
                }
            } else window.location.reload();
        }
        if (data.type === 'error') {
            // Log parcel errors to console
            var _iterator = _createForOfIteratorHelper(data.diagnostics.ansi), _step;
            try {
                for(_iterator.s(); !(_step = _iterator.n()).done;){
                    var ansiDiagnostic = _step.value;
                    var stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                    console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
                }
            } catch (err) {
                _iterator.e(err);
            } finally{
                _iterator.f();
            }
            if (typeof document !== 'undefined') {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html); // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn('[parcel] 🚨 Connection to the HMR server was lost');
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log('[parcel] ✨ Error resolved');
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    var errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    var _iterator2 = _createForOfIteratorHelper(diagnostics), _step2;
    try {
        for(_iterator2.s(); !(_step2 = _iterator2.n()).done;){
            var diagnostic = _step2.value;
            var stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
            errorHTML += "\n      <div>\n        <div style=\"font-size: 18px; font-weight: bold; margin-top: 20px;\">\n          \uD83D\uDEA8 ".concat(diagnostic.message, "\n        </div>\n        <pre>").concat(stack, "</pre>\n        <div>\n          ").concat(diagnostic.hints.map(function(hint) {
                return '<div>💡 ' + hint + '</div>';
            }).join(''), "\n        </div>\n        ").concat(diagnostic.documentation ? "<div>\uD83D\uDCDD <a style=\"color: violet\" href=\"".concat(diagnostic.documentation, "\" target=\"_blank\">Learn more</a></div>") : '', "\n      </div>\n    ");
        }
    } catch (err) {
        _iterator2.e(err);
    } finally{
        _iterator2.f();
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', link.getAttribute('href').split('?')[0] + '?' + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(window.location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        var deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                var oldDeps = modules[asset.id][1];
                for(var dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    var id = oldDeps[dep];
                    var parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            var fn = new Function('require', 'module', 'exports', asset.output);
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id1) {
    var modules = bundle.modules;
    if (!modules) return;
    if (modules[id1]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        var deps = modules[id1][1];
        var orphans = [];
        for(var dep in deps){
            var parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        } // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id1];
        delete bundle.cache[id1]; // Now delete the orphans.
        orphans.forEach(function(id) {
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id1);
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
     // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    var parents = getParents(module.bundle.root, id);
    var accepted = false;
    while(parents.length > 0){
        var v = parents.shift();
        var a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            var p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push.apply(parents, _toConsumableArray(p));
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle, id, depsByBundle) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToAccept.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) return true;
}
function hmrAcceptRun(bundle, id) {
    var cached = bundle.cache[id];
    bundle.hotData = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData;
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData);
    });
    delete bundle.cache[id];
    bundle(id);
    cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) // $FlowFixMe[method-unbinding]
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
    });
    acceptedAssets[id] = true;
}

},{}],"h7u1C":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _webgl2Renderer = require("./webgl2_renderer");
var _webgl2RendererDefault = parcelHelpers.interopDefault(_webgl2Renderer);
var _simple = require("./simple");
var _simpleDefault = parcelHelpers.interopDefault(_simple);
const renderer = new _webgl2RendererDefault.default(_simpleDefault.default);

},{"./simple":"89Mlp","./webgl2_renderer":"6Lkv5","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"89Mlp":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _scene = require("./scene");
var _sceneDefault = parcelHelpers.interopDefault(_scene);
var _color = require("./color");
const scene = new _sceneDefault.default();
scene.addNode({
    x: 50,
    y: 100,
    color: _color.material.red
});
scene.addNode({
    x: 300,
    y: 100,
    color: _color.material.pink
});
scene.addNode({
    x: 550,
    y: 100,
    color: _color.material.purple
});
scene.addNode({
    x: 800,
    y: 100,
    color: _color.material.deepPurple
});
scene.addNode({
    x: 1050,
    y: 100,
    color: _color.material.indigo
});
scene.addNode({
    x: 50,
    y: 250,
    color: _color.material.blue
});
scene.addNode({
    x: 300,
    y: 250,
    color: _color.material.lightBlue
});
scene.addNode({
    x: 550,
    y: 250,
    color: _color.material.cyan
});
scene.addNode({
    x: 800,
    y: 250,
    color: _color.material.teal
});
scene.addNode({
    x: 1050,
    y: 250,
    color: _color.material.green
});
scene.addNode({
    x: 50,
    y: 400,
    color: _color.material.brown
});
scene.addNode({
    x: 300,
    y: 400,
    color: _color.material.grey
});
scene.addNode({
    x: 550,
    y: 400,
    color: _color.material.blueGrey
});
exports.default = scene;

},{"./scene":"8XkT2","./color":"cVzcX","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"8XkT2":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
exports.default = class {
    constructor(){
        this.positions = [];
        this.colors = [];
        this.triangles = 0;
    }
    addNode({ x , y , color  }) {
        const dpr = window.devicePixelRatio;
        const x1 = x;
        const y1 = y;
        const { r , g , b  } = color;
        const x2 = x1 + 200;
        const y2 = y1 + 25;
        const y3 = y2 + 1;
        const y4 = y2 + 75;
        const vertices = [
            x1,
            y1,
            x2,
            y1,
            x2,
            y2,
            x1,
            y1,
            x1,
            y2,
            x2,
            y2,
            x1,
            y2,
            x2,
            y2,
            x2,
            y3,
            x1,
            y2,
            x1,
            y3,
            x2,
            y3,
            x1,
            y3,
            x2,
            y3,
            x2,
            y4,
            x1,
            y3,
            x1,
            y4,
            x2,
            y4, 
        ];
        this.positions.push(vertices);
        this.colors.push([
            r,
            g,
            b,
            r,
            g,
            b,
            r,
            g,
            b,
            r,
            g,
            b,
            r,
            g,
            b,
            r,
            g,
            b,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            66,
            66,
            66,
            66,
            66,
            66,
            66,
            66,
            66,
            66,
            66,
            66,
            66,
            66,
            66,
            66,
            66,
            66, 
        ]);
        this.triangles += vertices.length / 2;
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"cVzcX":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "material", ()=>material
);
const material = {
    red: {
        r: 198,
        g: 40,
        b: 40
    },
    pink: {
        r: 173,
        g: 20,
        b: 87
    },
    purple: {
        r: 106,
        g: 27,
        b: 154
    },
    deepPurple: {
        r: 69,
        g: 39,
        b: 160
    },
    indigo: {
        r: 40,
        g: 53,
        b: 147
    },
    blue: {
        r: 21,
        g: 101,
        b: 192
    },
    lightBlue: {
        r: 2,
        g: 119,
        b: 189
    },
    cyan: {
        r: 0,
        g: 131,
        b: 143
    },
    teal: {
        r: 0,
        g: 105,
        b: 92
    },
    green: {
        r: 46,
        g: 125,
        b: 50
    },
    brown: {
        r: 78,
        g: 52,
        b: 46
    },
    grey: {
        r: 117,
        g: 117,
        b: 117
    },
    blueGrey: {
        r: 55,
        g: 71,
        b: 79
    }
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"6Lkv5":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
const vertexShaderSource = `#version 300 es
uniform float uDevicePixelRatio;
uniform vec2 uResolution;
in vec2 aPosition;
in vec3 aColor;
out vec3 vColor;

void main() {
  vColor = aColor;
  vec2 clipSpace = aPosition * uDevicePixelRatio / uResolution * 2.0 - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0.0, 1.0);
}
`;
const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec3 vColor;
out vec4 fragColor;

void main() {
  fragColor = vec4(vColor, 1.0);
}
`;
class Renderer {
    constructor(scene){
        this.scene = scene;
        this.onResize = (entries)=>{
            const gl = this.gl;
            entries.map((entry)=>{
                if (entry.devicePixelContentBoxSize) return {
                    entry: entry,
                    width: entry.devicePixelContentBoxSize[0].inlineSize,
                    height: entry.devicePixelContentBoxSize[0].blockSize,
                    dpr: 1
                };
                if (entry.contentBoxSize) return {
                    entry: entry,
                    width: entry.contentBoxSize[0].inlineSize,
                    height: entry.contentBoxSize[0].blockSize,
                    dpr: window.devicePixelRatio
                };
                return {
                    entry: entry,
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                    dpr: window.devicePixelRatio
                };
            }).forEach(({ entry , width , height , dpr  })=>{
                const canvas = entry.target;
                canvas.width = Math.round(width * dpr);
                canvas.height = Math.round(height * dpr);
            });
            gl.uniform2f(this.uResolution, gl.canvas.width, gl.canvas.height);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            this.ctx.canvas.width = gl.canvas.width;
            this.ctx.canvas.height = gl.canvas.height;
            this.render();
        };
        this.render = ()=>{
            const gl = this.gl;
            const ctx = this.ctx;
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.position.buffer);
            {
                const data = new Float32Array(this.scene.triangles * 2);
                let i = 0;
                for (const vertices of this.scene.positions)for (const vertex of vertices)data[i++] = vertex;
                gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
            }
            gl.vertexAttribPointer(this.position.location, /*size*/ 2, /*type*/ gl.FLOAT, /*normalize*/ false, /*stride*/ 0, /*offset*/ 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.color.buffer);
            {
                const data = new Uint8Array(this.scene.triangles * 3);
                let i = 0;
                for (const colors of this.scene.colors)for (const color of colors)data[i++] = color;
                gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
            }
            gl.vertexAttribPointer(this.color.location, /*size*/ 3, /*type*/ gl.UNSIGNED_BYTE, /*normalize*/ true, /*stride*/ 0, /*offset*/ 0);
            gl.drawArrays(gl.TRIANGLES, /*offset*/ 0, /*count*/ this.scene.triangles);
            const dpr = window.devicePixelRatio;
            ctx.clearRect(0, 0, gl.canvas.width, gl.canvas.height);
            ctx.font = `${24 * dpr}px sans-serif`;
            ctx.fillStyle = 'white';
            ctx.fillText('foo', 55 * dpr, 121 * dpr);
        };
        const gl_canvas = document.createElement('canvas');
        gl_canvas.style.width = '100%';
        gl_canvas.style.height = '100%';
        gl_canvas.style.position = 'absolute';
        document.body.appendChild(gl_canvas);
        const text_canvas = document.createElement('canvas');
        text_canvas.style.width = '100%';
        text_canvas.style.height = '100%';
        text_canvas.style.position = 'absolute';
        document.body.appendChild(text_canvas);
        const gl1 = gl_canvas.getContext('webgl2');
        this.gl = gl1;
        gl1.clearColor(33 / 255, 33 / 255, 33 / 255, 1);
        this.ctx = text_canvas.getContext('2d');
        const vertexShader = gl1.createShader(gl1.VERTEX_SHADER);
        gl1.shaderSource(vertexShader, vertexShaderSource);
        gl1.compileShader(vertexShader);
        const fragmentShader = gl1.createShader(gl1.FRAGMENT_SHADER);
        gl1.shaderSource(fragmentShader, fragmentShaderSource);
        gl1.compileShader(fragmentShader);
        const program = gl1.createProgram();
        gl1.attachShader(program, vertexShader);
        gl1.attachShader(program, fragmentShader);
        gl1.linkProgram(program);
        if (!gl1.getProgramParameter(program, gl1.LINK_STATUS)) {
            console.log(gl1.getShaderInfoLog(vertexShader));
            console.log(gl1.getShaderInfoLog(fragmentShader));
        }
        gl1.useProgram(program);
        this.uResolution = gl1.getUniformLocation(program, 'uResolution');
        const uDevicePixelRatio = gl1.getUniformLocation(program, 'uDevicePixelRatio');
        gl1.uniform1f(uDevicePixelRatio, window.devicePixelRatio);
        this.position = {
            location: gl1.getAttribLocation(program, 'aPosition'),
            buffer: gl1.createBuffer()
        };
        gl1.enableVertexAttribArray(this.position.location);
        this.color = {
            location: gl1.getAttribLocation(program, 'aColor'),
            buffer: gl1.createBuffer()
        };
        gl1.enableVertexAttribArray(this.color.location);
        const resizeObserver = new ResizeObserver(this.onResize);
        try {
            resizeObserver.observe(gl_canvas, {
                box: 'device-pixel-content-box'
            });
        } catch (ex) {
            resizeObserver.observe(gl_canvas, {
                box: 'content-box'
            });
        }
    }
}
exports.default = Renderer;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["8wcER","h7u1C"], "h7u1C", "parcelRequiredb27")

//# sourceMappingURL=index.b71e74eb.js.map
