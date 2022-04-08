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
})({"fRL6l":[function(require,module,exports) {
"use strict";
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "78fcd0ac8e9bd240";
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

},{}],"1jwFz":[function(require,module,exports) {
const grid = 50;
const state = {
    graph: {
        numbers: {
            xs: [],
            ys: [],
            literals: []
        },
        calls: {
            xs: [],
            ys: [],
            names: [],
            arguments: []
        }
    },
    cursor: {
        x: Math.round(window.innerWidth / 2 / grid) * grid - grid / 2,
        y: Math.round(window.innerHeight / 2 / grid) * grid - grid / 2
    },
    grid,
    repeat: ''
};
const glCanvas = document.querySelector('#gl');
glCanvas.width = window.innerWidth;
glCanvas.height = window.innerHeight;
const gl = glCanvas.getContext('webgl2');
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
const textCanvas = document.querySelector('#text');
textCanvas.width = window.innerWidth;
textCanvas.height = window.innerHeight;
const ctx = textCanvas.getContext('2d');
const vertexShaderSource = `#version 300 es

in vec2 a_position;

uniform vec2 u_resolution;

void main() {
  vec2 zeroToOne = a_position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`;
const fragmentShaderSource = `#version 300 es

precision highp float;

uniform vec4 u_color;

out vec4 outColor;

void main() {
  outColor = u_color;
}
`;
const createShader = (gl1, shader_type, source)=>{
    const shader = gl1.createShader(shader_type);
    gl1.shaderSource(shader, source);
    gl1.compileShader(shader);
    const success = gl1.getShaderParameter(shader, gl1.COMPILE_STATUS);
    if (success) return shader;
    console.log(gl1.getShaderInfoLog(shader));
    gl1.deleteShader(shader);
};
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const createProgram = (gl2, vertexShader1, fragmentShader1)=>{
    const program1 = gl2.createProgram();
    gl2.attachShader(program1, vertexShader1);
    gl2.attachShader(program1, fragmentShader1);
    gl2.linkProgram(program1);
    const success = gl2.getProgramParameter(program1, gl2.LINK_STATUS);
    if (success) return program1;
    console.log(gl2.getProgramInfoLog(program1));
    gl2.deleteProgram(program1);
};
const program = createProgram(gl, vertexShader, fragmentShader);
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
const positionBuffer = gl.createBuffer();
const vao = gl.createVertexArray();
gl.bindVertexArray(vao);
gl.enableVertexAttribArray(positionAttributeLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
{
    const size = 2;
    const dtype = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, dtype, normalize, stride, offset);
}const resizeCanvasToDisplaySize = (canvas)=>{
    const dpr = window.devicePixelRatio;
    const { width: width1 , height: height1  } = canvas.getBoundingClientRect();
    const displayWidth = Math.round(width1 * dpr);
    const displayHeight = Math.round(height1 * dpr);
    const needResize = canvas.width != displayWidth || canvas.height != displayHeight;
    if (needResize) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
    return needResize;
};
const resoltionUniformLocation = gl.getUniformLocation(program, "u_resolution");
resizeCanvasToDisplaySize(gl.canvas);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0.27, 0.35, 0.39, 1);
gl.useProgram(program);
gl.uniform2f(resoltionUniformLocation, gl.canvas.width, gl.canvas.height);
gl.bindVertexArray(vao);
const randomInt = (range)=>Math.floor(Math.random() * range)
;
const setRectangle = (gl3, x, y, width2, height2)=>{
    const x1 = x;
    const x2 = x + width2;
    const y1 = y;
    const y2 = y + height2;
    gl3.bufferData(gl3.ARRAY_BUFFER, new Float32Array([
        x1,
        y1,
        x2,
        y1,
        x1,
        y2,
        x1,
        y2,
        x2,
        y1,
        x2,
        y2, 
    ]), gl3.STATIC_DRAW);
};
const colorLocation = gl.getUniformLocation(program, "u_color");
const primitiveType = gl.TRIANGLES;
const offset = 0;
const count = 6;
gl.clear(gl.COLOR_BUFFER_BIT);
const width = 200;
const height = 105;
const renderNumbers = (numbers)=>{
    numbers.xs.map((x, i)=>{
        const y = numbers.ys[i];
        // function name
        setRectangle(gl, x, y, width, 40);
        gl.uniform4f(colorLocation, 0.1, 0.46, 0.82, 1);
        gl.drawArrays(primitiveType, offset, count);
        ctx.font = '22px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText('Number', x + 5, y + 28);
        // function body
        setRectangle(gl, x, y + 40, 200, height - 40);
        gl.uniform4f(colorLocation, 0.11, 0.19, 0.23, 1);
        gl.drawArrays(primitiveType, offset, count);
        // literal
        setRectangle(gl, x, y + 40, 200, height - 40);
        gl.uniform4f(colorLocation, 0.11, 0.19, 0.23, 1);
        gl.drawArrays(primitiveType, offset, count);
        // result
        setRectangle(gl, x + 180, y + 55, 10, 10);
        gl.uniform4f(colorLocation, 0.39, 0.64, 1, 1);
        gl.drawArrays(primitiveType, offset, count);
    });
};
const renderCalls = (calls)=>{
    calls.xs.map((x, i)=>{
        const y = calls.ys[i];
        // function name
        setRectangle(gl, x, y, width, 40);
        gl.uniform4f(colorLocation, 0.1, 0.46, 0.82, 1);
        gl.drawArrays(primitiveType, offset, count);
        ctx.font = '22px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText('Add', x + 5, y + 28);
        // function body
        setRectangle(gl, x, y + 40, 200, height - 40);
        gl.uniform4f(colorLocation, 0.11, 0.19, 0.23, 1);
        gl.drawArrays(primitiveType, offset, count);
        // x
        setRectangle(gl, x + 10, y + 55, 10, 10);
        gl.uniform4f(colorLocation, 0.39, 0.64, 1, 1);
        gl.drawArrays(primitiveType, offset, count);
        ctx.font = '18px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText('x', x + 30, y + 65);
        // y
        setRectangle(gl, x + 10, y + 80, 10, 10);
        gl.uniform4f(colorLocation, 0.39, 0.64, 1, 1);
        gl.drawArrays(primitiveType, offset, count);
        ctx.font = '18px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText('y', x + 30, y + 90);
        // result
        setRectangle(gl, x + 180, y + 55, 10, 10);
        gl.uniform4f(colorLocation, 0.39, 0.64, 1, 1);
        gl.drawArrays(primitiveType, offset, count);
        ctx.font = '18px sans-serif';
        ctx.fillStyle = 'white';
        ctx.fillText('result', x + 125, y + 65);
    });
};
const mainLoop = ()=>{
    gl.clear(gl.COLOR_BUFFER_BIT);
    ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    for(let x = state.grid / 2; x < textCanvas.width; x += state.grid){
        setRectangle(gl, x, 0, 1, textCanvas.height);
        gl.uniform4f(colorLocation, 1, 1, 1, 0.1);
        gl.drawArrays(primitiveType, offset, count);
    }
    for(let y = state.grid / 2; y < textCanvas.height; y += state.grid){
        setRectangle(gl, 0, y, textCanvas.width, 1);
        gl.uniform4f(colorLocation, 1, 1, 1, 0.1);
        gl.drawArrays(primitiveType, offset, count);
    }
    renderNumbers(state.graph.numbers);
    renderCalls(state.graph.calls);
    // cursor
    const x3 = state.cursor.x - width / 2;
    const y3 = state.cursor.y - height / 2;
    setRectangle(gl, x3 + width / 2 - 15, y3 + height / 2 - 1, 30, 2);
    gl.uniform4f(colorLocation, 1, 1, 1, 1);
    gl.drawArrays(primitiveType, offset, count);
    setRectangle(gl, x3 + width / 2 - 1, y3 + height / 2 - 15, 2, 30);
    gl.uniform4f(colorLocation, 1, 1, 1, 1);
    gl.drawArrays(primitiveType, offset, count);
    requestAnimationFrame(mainLoop);
};
requestAnimationFrame(mainLoop);
document.addEventListener('mousemove', (event)=>{
    state.cursor.x = Math.round(event.clientX / state.grid) * state.grid - state.grid / 2;
    state.cursor.y = Math.round(event.clientY / state.grid) * state.grid - state.grid / 2;
});
const addNumber = (state1)=>{
    state1.graph.numbers.xs.push(state1.cursor.x);
    state1.graph.numbers.ys.push(state1.cursor.y);
    state1.graph.numbers.literals.push('');
};
const addCall = (state2)=>{
    state2.graph.calls.xs.push(state2.cursor.x);
    state2.graph.calls.ys.push(state2.cursor.y);
    state2.graph.calls.names.push('Add');
    state2.graph.calls.arguments.push([
        'x',
        'y'
    ]);
};
const repeat = (state3)=>{
    if (state3.repeat.length > 0) {
        const result = parseInt(state3.repeat);
        state3.repeat = '';
        return result;
    }
    return 1;
};
document.addEventListener('keypress', (event)=>{
    switch(event.key){
        case 'n':
            addNumber(state);
            break;
        case 'c':
            addCall(state);
            break;
        case 'h':
            state.cursor.x -= state.grid * repeat(state);
            break;
        case 'j':
            state.cursor.y += state.grid * repeat(state);
            break;
        case 'k':
            state.cursor.y -= state.grid * repeat(state);
            break;
        case 'l':
            state.cursor.x += state.grid * repeat(state);
            break;
        case '0':
            state.repeat += '0';
            break;
        case '1':
            state.repeat += '1';
            break;
        case '2':
            state.repeat += '2';
            break;
        case '3':
            state.repeat += '3';
            break;
        case '4':
            state.repeat += '4';
            break;
        case '5':
            state.repeat += '5';
            break;
        case '6':
            state.repeat += '6';
            break;
        case '7':
            state.repeat += '7';
            break;
        case '8':
            state.repeat += '8';
            break;
        case '9':
            state.repeat += '9';
            break;
        default:
            console.log(event.key);
    }
});
window.addEventListener('resize', ()=>{
    gl.canvas.width = window.innerWidth;
    gl.canvas.height = window.innerHeight;
    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(resoltionUniformLocation, gl.canvas.width, gl.canvas.height);
    textCanvas.width = window.innerWidth;
    textCanvas.height = window.innerHeight;
});

},{}]},["fRL6l","1jwFz"], "1jwFz", "parcelRequire824e")

//# sourceMappingURL=index.8e9bd240.js.map
