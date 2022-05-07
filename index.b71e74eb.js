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
var _studio = require("./studio");
const ecs = new _studio.ECS();
let viewport = {
    x: 0,
    y: 0,
    width: 500,
    height: 500
};
const renderer = new _studio.renderer.WebGL2(viewport);
renderer.element.style.width = '100%';
renderer.element.style.height = '100%';
renderer.element.style.touchAction = 'none';
document.body.appendChild(renderer.element);
const camera = ecs.entity();
ecs.set(new _studio.ActiveCamera(camera));
const [near, far] = [
    500,
    -500
];
const onResize = ()=>{
    viewport.width = renderer.element.clientWidth;
    viewport.height = renderer.element.clientHeight;
    camera.set(_studio.orthographicProjection({
        ...viewport,
        near,
        far
    }));
    renderer.viewport(viewport);
};
onResize();
window.addEventListener('resize', onResize);
const addPlane = (x, y, h)=>ecs.entity(_studio.planeGeometry(), new _studio.Translate({
        x,
        y,
        z: 0
    }), new _studio.Rotate({
        x: 0,
        y: 0,
        z: 0
    }), new _studio.Scale({
        x: 10,
        y: 10,
        z: 1
    }), new _studio.Fill({
        h,
        s: 1,
        l: 0.7,
        a: 1
    }), new _studio.Root())
;
let mouseHeld = false;
document.addEventListener('mousedown', (e)=>{
    mouseHeld = true;
    addPlane(e.x, e.y, Math.floor(Math.random() * 360));
    renderer.render(ecs);
});
document.addEventListener('mouseup', (e)=>{
    mouseHeld = false;
});
let lastTime = 0;
const update = (currentTime)=>{
    requestAnimationFrame(update);
    for (const entity of ecs.query(_studio.Rotate))entity.update(_studio.Rotate, (rotate)=>rotate.x += (currentTime - lastTime) / 1000
    );
    lastTime = currentTime;
    renderer.render(ecs);
};
document.addEventListener('pointermove', (e)=>{
    if (mouseHeld) for (const c of e.getCoalescedEvents())addPlane(c.x, c.y, Math.floor(Math.random() * 360));
    renderer.render(ecs);
});
document.addEventListener('touchmove', (e)=>{
    for (const touch of e.touches)addPlane(touch.clientX, touch.clientY, Math.floor(Math.random() * 360));
    renderer.render(ecs);
});
requestAnimationFrame(update);

},{"./studio":"kNHuv"}],"kNHuv":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "renderer", ()=>_renderer
);
parcelHelpers.export(exports, "ECS", ()=>_ecs.ECS
);
parcelHelpers.export(exports, "Entity", ()=>_ecs.Entity
);
parcelHelpers.export(exports, "orthographicProjection", ()=>_components.orthographicProjection
);
parcelHelpers.export(exports, "perspectiveProjection", ()=>_components.perspectiveProjection
);
parcelHelpers.export(exports, "ActiveCamera", ()=>_components.ActiveCamera
);
parcelHelpers.export(exports, "Geometry", ()=>_components.Geometry
);
parcelHelpers.export(exports, "planeGeometry", ()=>_components.planeGeometry
);
parcelHelpers.export(exports, "Translate", ()=>_components.Translate
);
parcelHelpers.export(exports, "Rotate", ()=>_components.Rotate
);
parcelHelpers.export(exports, "Scale", ()=>_components.Scale
);
parcelHelpers.export(exports, "Fill", ()=>_components.Fill
);
parcelHelpers.export(exports, "Root", ()=>_components.Root
);
parcelHelpers.export(exports, "Children", ()=>_components.Children
);
var _renderer = require("./renderer");
var _ecs = require("./ecs");
var _components = require("./components");

},{"./renderer":"8Zv19","./ecs":"bCZLy","./components":"563zL","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"8Zv19":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "WebGL2", ()=>_webgl2.Renderer
);
var _webgl2 = require("./webgl2");

},{"./webgl2":"lvG69","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"lvG69":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Renderer", ()=>Renderer
);
var _components = require("../components");
class Renderer {
    constructor(viewport){
        const canvas = document.createElement('canvas');
        canvas.style.width = viewport.width.toString();
        canvas.style.height = viewport.height.toString();
        canvas.style.display = 'block';
        const gl = canvas.getContext('webgl2');
        gl.clearColor(0, 0, 0, 1);
        this.element = canvas;
        this.gl = gl;
        this.maxBatchSize = Math.floor(gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS) / 5);
        const vertexShaderSource = `#version 300 es
uniform mat4[${this.maxBatchSize}] u_matrix;
uniform vec4[${this.maxBatchSize}] u_color;

in vec4 a_position;
in uint a_index;

out vec4 v_color;

void main() {
  gl_Position = u_matrix[a_index] * a_position;
  v_color = u_color[a_index];
}
`;
        const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec4 v_color;
out vec4 fragColor;

vec4 hslToRgb(in vec4 hsl) {
 float h = hsl.x / 360.0;
 vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
 return vec4(hsl.z + hsl.y * (rgb - 0.5) * (1.0 - abs(2.0 * hsl.z - 1.0)), hsl.w);
}

void main() {
  fragColor = hslToRgb(v_color);
}
`;
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.log(gl.getShaderInfoLog(vertexShader));
            console.log(gl.getShaderInfoLog(fragmentShader));
        }
        gl.useProgram(program);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        this.aPosition = {
            buffer: gl.createBuffer(),
            location: gl.getAttribLocation(program, 'a_position')
        };
        gl.enableVertexAttribArray(this.aPosition.location);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.aPosition.buffer);
        gl.vertexAttribPointer(this.aPosition.location, /*size*/ 3, /*type*/ gl.FLOAT, /*normalize*/ false, /*stride*/ 0, /*offset*/ 0);
        this.vertexIndexBuffer = gl.createBuffer();
        this.aIndex = {
            buffer: gl.createBuffer(),
            location: gl.getAttribLocation(program, 'a_index')
        };
        gl.enableVertexAttribArray(this.aIndex.location);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.aIndex.buffer);
        gl.vertexAttribIPointer(this.aIndex.location, /*size*/ 1, /*type*/ gl.UNSIGNED_SHORT, /*stride*/ 0, /*offset*/ 0);
        this.uMatrix = gl.getUniformLocation(program, 'u_matrix');
        this.uColor = gl.getUniformLocation(program, 'u_color');
        this.viewport(viewport);
    }
    viewport = ({ x , y , width , height  })=>{
        this.element.width = width;
        this.element.height = height;
        this.gl.viewport(x, y, width, height);
    };
    renderEntities = function*(ecs) {
        const renderChildren = function*(renderData) {
            const children = renderData.entity.get(_components.Children);
            if (children) for (const child of children.entities){
                const localTransform = child.get(_components.Translate).matrix().mul(child.get(_components.Rotate).matrix()).mul(child.get(_components.Scale).matrix());
                const transform = renderData.transform.mul(localTransform);
                const childRenderData = {
                    entity: child,
                    transform
                };
                yield childRenderData;
                yield* renderChildren(childRenderData);
            }
        };
        const camera = ecs.get(_components.ActiveCamera).entity;
        const view = camera.get(_components.Projection).matrix;
        for (const root of ecs.query(_components.Root)){
            const localTransform = root.get(_components.Translate).matrix().mul(root.get(_components.Rotate).matrix()).mul(root.get(_components.Scale).matrix());
            const transform = view.mul(localTransform);
            const renderData = {
                transform,
                entity: root
            };
            yield renderData;
            yield* renderChildren(renderData);
        }
    };
    render = (ecs)=>{
        const start = performance.now();
        const gl = this.gl;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        const camera = ecs.get(_components.ActiveCamera).entity;
        const view = camera.get(_components.Projection).matrix;
        let positions = [];
        let vertexIndices = [];
        let indices = [];
        let matrices = [];
        let fills = [];
        let index = 0;
        let offset = 0;
        const drawBatch = ()=>{
            gl.uniformMatrix4fv(this.uMatrix, /*transpose*/ false, matrices);
            gl.uniform4fv(this.uColor, fills);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.aPosition.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.aIndex.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
            gl.drawElements(gl.TRIANGLES, /*count*/ vertexIndices.length, /*index type*/ gl.UNSIGNED_SHORT, /*offset*/ 0);
        };
        for (const { entity , transform  } of this.renderEntities(ecs)){
            const geometry = entity.get(_components.Geometry);
            if (!geometry) continue;
            positions.push(...geometry.vertices);
            for (const i of geometry.indices)vertexIndices.push(i + offset);
            const vertexCount = geometry.vertices.length / 3;
            offset += vertexCount;
            matrices.push(...transform.data);
            const fill = entity.get(_components.Fill);
            fills.push(fill.h, fill.s, fill.l, fill.a);
            for(let i1 = 0; i1 < vertexCount; ++i1)indices.push(index);
            if (++index == this.maxBatchSize) {
                drawBatch();
                positions = [];
                vertexIndices = [];
                indices = [];
                matrices = [];
                fills = [];
                index = 0;
                offset = 0;
            }
        }
        if (index != 0) drawBatch();
        const stop = performance.now();
    //console.log(stop - start)
    };
}

},{"../components":"563zL","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"563zL":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Projection", ()=>Projection
);
parcelHelpers.export(exports, "orthographicProjection", ()=>orthographicProjection
);
parcelHelpers.export(exports, "perspectiveProjection", ()=>perspectiveProjection
);
parcelHelpers.export(exports, "ActiveCamera", ()=>ActiveCamera
);
parcelHelpers.export(exports, "Geometry", ()=>Geometry
);
parcelHelpers.export(exports, "Translate", ()=>Translate
);
parcelHelpers.export(exports, "Scale", ()=>Scale
);
parcelHelpers.export(exports, "Rotate", ()=>Rotate
);
parcelHelpers.export(exports, "planeGeometry", ()=>planeGeometry
);
parcelHelpers.export(exports, "Fill", ()=>Fill
);
parcelHelpers.export(exports, "Children", ()=>Children
);
parcelHelpers.export(exports, "Root", ()=>Root
);
var _linearAlgebra = require("./linear_algebra");
class Projection {
    constructor(matrix){
        this.matrix = matrix;
    }
}
const orthographicProjection = ({ x , y , width , height , near , far  })=>{
    const left = x;
    const right = x + width;
    const top = y;
    const bottom = y + height;
    return new Projection(new _linearAlgebra.Mat4x4([
        2 / (right - left),
        0,
        0,
        0,
        0,
        2 / (top - bottom),
        0,
        0,
        0,
        0,
        2 / (near - far),
        0,
        (left + right) / (left - right),
        (bottom + top) / (bottom - top),
        (near + far) / (near - far),
        1
    ]));
};
const perspectiveProjection = ({ fieldOfView , width , height , near , far  })=>{
    const aspectRatio = width / height;
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfView);
    const rangeInv = 1 / (near - far);
    return new Projection(new _linearAlgebra.Mat4x4([
        f / aspectRatio,
        0,
        0,
        0,
        0,
        f,
        0,
        0,
        0,
        0,
        (near + far) * rangeInv,
        -1,
        0,
        0,
        near * far * rangeInv * 2,
        0, 
    ]));
};
class ActiveCamera {
    constructor(entity){
        this.entity = entity;
    }
}
class Geometry {
    constructor(data){
        this.vertices = data.vertices;
        this.indices = data.indices;
    }
}
class Translate {
    constructor(vec){
        this.x = vec.x;
        this.y = vec.y;
        this.z = vec.z;
    }
    matrix = ()=>new _linearAlgebra.Mat4x4([
            1,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1,
            0,
            this.x,
            this.y,
            this.z,
            1, 
        ])
    ;
}
class Scale {
    constructor(vec){
        this.x = vec.x;
        this.y = vec.y;
        this.z = vec.z;
    }
    matrix = ()=>new _linearAlgebra.Mat4x4([
            this.x,
            0,
            0,
            0,
            0,
            this.y,
            0,
            0,
            0,
            0,
            this.z,
            0,
            0,
            0,
            0,
            1, 
        ])
    ;
}
class Rotate {
    constructor(vec){
        this.x = vec.x;
        this.y = vec.y;
        this.z = vec.z;
    }
    xMatrix = ()=>{
        const radians = this.x;
        const c = Math.cos(radians);
        const s = Math.sin(radians);
        return new _linearAlgebra.Mat4x4([
            1,
            0,
            0,
            0,
            0,
            c,
            s,
            0,
            0,
            -s,
            c,
            0,
            0,
            0,
            0,
            1, 
        ]);
    };
    yMatrix = ()=>{
        const radians = this.y;
        const c = Math.cos(radians);
        const s = Math.sin(radians);
        return new _linearAlgebra.Mat4x4([
            c,
            0,
            -s,
            0,
            0,
            1,
            0,
            0,
            s,
            0,
            c,
            0,
            0,
            0,
            0,
            1, 
        ]);
    };
    zMatrix = ()=>{
        const radians = this.z;
        const c = Math.cos(radians);
        const s = Math.sin(radians);
        return new _linearAlgebra.Mat4x4([
            c,
            s,
            0,
            0,
            -s,
            c,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1, 
        ]);
    };
    matrix = ()=>this.xMatrix().mul(this.yMatrix()).mul(this.zMatrix())
    ;
}
const planeGeometry = ()=>new Geometry({
        vertices: [
            -0.5,
            -0.5,
            0,
            -0.5,
            0.5,
            0,
            0.5,
            0.5,
            0,
            0.5,
            -0.5,
            0, 
        ],
        indices: [
            0,
            1,
            2,
            3,
            0,
            2,
            2,
            1,
            0,
            2,
            0,
            3, 
        ]
    })
;
class Fill {
    constructor(hsla){
        this.h = hsla.h;
        this.s = hsla.s;
        this.l = hsla.l;
        this.a = hsla.a;
    }
}
class Children {
    constructor(entities){
        this.entities = entities;
    }
}
class Root {
}

},{"./linear_algebra":"8TRXG","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"8TRXG":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Mat4x4", ()=>Mat4x4
);
class Mat4x4 {
    constructor(data){
        this.data = data;
        this.mul = (other)=>{
            const a = this.data;
            const b = other.data;
            return new Mat4x4([
                b[0] * a[0] + b[1] * a[4] + b[2] * a[8] + b[3] * a[12],
                b[0] * a[1] + b[1] * a[5] + b[2] * a[9] + b[3] * a[13],
                b[0] * a[2] + b[1] * a[6] + b[2] * a[10] + b[3] * a[14],
                b[0] * a[3] + b[1] * a[7] + b[2] * a[11] + b[3] * a[15],
                b[4] * a[0] + b[5] * a[4] + b[6] * a[8] + b[7] * a[12],
                b[4] * a[1] + b[5] * a[5] + b[6] * a[9] + b[7] * a[13],
                b[4] * a[2] + b[5] * a[6] + b[6] * a[10] + b[7] * a[14],
                b[4] * a[3] + b[5] * a[7] + b[6] * a[11] + b[7] * a[15],
                b[8] * a[0] + b[9] * a[4] + b[10] * a[8] + b[11] * a[12],
                b[8] * a[1] + b[9] * a[5] + b[10] * a[9] + b[11] * a[13],
                b[8] * a[2] + b[9] * a[6] + b[10] * a[10] + b[11] * a[14],
                b[8] * a[3] + b[9] * a[7] + b[10] * a[11] + b[11] * a[15],
                b[12] * a[0] + b[13] * a[4] + b[14] * a[8] + b[15] * a[12],
                b[12] * a[1] + b[13] * a[5] + b[14] * a[9] + b[15] * a[13],
                b[12] * a[2] + b[13] * a[6] + b[14] * a[10] + b[15] * a[14],
                b[12] * a[3] + b[13] * a[7] + b[14] * a[11] + b[15] * a[15], 
            ]);
        };
    }
}

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

},{}],"bCZLy":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Entity", ()=>Entity
);
parcelHelpers.export(exports, "ECS", ()=>ECS
);
class Storage {
    constructor(){
        this.lookup = new Map();
        this.data = [];
        this.inverses = [];
    }
    get = (entity)=>{
        const index = this.lookup.get(entity.id);
        return index != undefined ? this.data[index] : undefined;
    };
    hasId = (id)=>{
        return this.lookup.has(id);
    };
    set = (entity, component)=>{
        const index = this.lookup.get(entity.id);
        if (index) {
            this.data[index] = component;
            this.inverses[index] = entity.id;
            return;
        }
        this.lookup.set(entity.id, this.data.length);
        this.data.push(component);
        this.inverses.push(entity.id);
    };
}
class Entity {
    constructor(id, ecs){
        this.id = id;
        this.ecs = ecs;
        this.set = (...components)=>{
            for (const component of components){
                const Type = component.constructor;
                let storage = this.ecs.storages.get(Type);
                if (!storage) {
                    storage = new Storage();
                    this.ecs.storages.set(Type, storage);
                }
                storage.set(this, component);
            }
            return this;
        };
        this.get = (Type)=>{
            const storage = this.ecs.storages.get(Type);
            return storage ? storage.get(this) : undefined;
        };
        this.update = (Type, f)=>{
            const storage = this.ecs.storages.get(Type);
            if (!storage) return;
            const component = storage.get(this);
            if (!component) return;
            f(component);
        };
    }
}
class ECS {
    constructor(){
        this.nextEntityId = 0;
        this.storages = new Map();
        this.resources = new Map();
    }
    entity = (...components)=>{
        const entity = new Entity(this.nextEntityId, this);
        entity.set(...components);
        ++this.nextEntityId;
        return entity;
    };
    query = function*(...components) {
        const primary = this.storages.get(components[0]);
        if (!primary) return;
        const secondary = components.slice(1).map((s)=>this.storages.get(s)
        );
        for (const id of primary.inverses)if (secondary.every((storage)=>storage.hasId(id)
        )) yield new Entity(id, this);
    };
    set = (...components)=>{
        for (const component of components){
            const Type = component.constructor;
            this.resources.set(Type, component);
        }
    };
    get = (Type)=>{
        return this.resources.get(Type);
    };
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["8wcER","h7u1C"], "h7u1C", "parcelRequire045c")

//# sourceMappingURL=index.b71e74eb.js.map
