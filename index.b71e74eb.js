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
})({"17ZdQ":[function(require,module,exports) {
"use strict";
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "5c1b77e3b71e74eb";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, chrome, browser, importScripts */ /*::
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
interface ExtensionContext {
  runtime: {|
    reload(): void,
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets, acceptedAssets, assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? "wss" : "ws";
    var ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/"); // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    } // $FlowFixMe
    ws.onmessage = async function(event) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        acceptedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        var data = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH); // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear(); // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets);
                for(var i = 0; i < assetsToAccept.length; i++){
                    var id = assetsToAccept[i][1];
                    if (!acceptedAssets[id]) hmrAcceptRun(assetsToAccept[i][0], id);
                }
            } else if ("reload" in location) location.reload();
            else {
                // Web extension context
                var ext = typeof chrome === "undefined" ? typeof browser === "undefined" ? null : browser : chrome;
                if (ext && ext.runtime && ext.runtime.reload) ext.runtime.reload();
            }
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
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
        console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>📝 <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
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
    newLink.setAttribute("href", link.getAttribute("href").split("?")[0] + "?" + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                if (asset.type === "js") {
                    if (typeof document !== "undefined") {
                        let script = document.createElement("script");
                        script.src = asset.url;
                        return new Promise((resolve, reject)=>{
                            var _document$head;
                            script.onload = ()=>resolve(script);
                            script.onerror = reject;
                            (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
                        });
                    } else if (typeof importScripts === "function") return new Promise((resolve, reject)=>{
                        try {
                            importScripts(asset.url);
                        } catch (err) {
                            reject(err);
                        }
                    });
                }
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id1) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id1]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id1][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        } // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id1];
        delete bundle.cache[id1]; // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id1);
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
     // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
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
var _components = require("./components");
var _linearAlgebra = require("./linear_algebra");
var _studio = require("./studio");
var _systems = require("./systems");
const { ECS , Renderer  } = _studio;
const { UIRoot , Alignment , Transform  } = _studio.components;
const { text , column , row , container , scene , stack  } = _studio.ui;
const { render , init  } = _studio.systems;
const ecs = new ECS();
const renderer = new Renderer(window.innerWidth, window.innerHeight);
renderer.canvas.style.width = "100%";
renderer.canvas.style.height = "100%";
const graph = scene(ecs);
const root = stack(ecs, [
    container(ecs, {
        color: new (0, _components.Color)(71, 52, 129, 255)
    }),
    graph
]);
const inputs = (n)=>column(ecs, Array.from({
        length: n
    }, (_, i)=>row(ecs, [
            container(ecs, {
                width: 18,
                height: 18,
                color: new (0, _components.Color)(101, 215, 249, 255),
                onClick: (0, _systems.clickInput)(graph)
            }),
            container(ecs, {
                width: 5,
                height: 0
            }),
            container(ecs, {
                padding: 2
            }, text(ecs, {
                fontSize: 18
            }, `in ${i}`)), 
        ])));
const outputs = (n)=>column(ecs, {
        crossAxisAlignment: Alignment.END
    }, Array.from({
        length: n
    }, (_, i)=>row(ecs, [
            container(ecs, {
                padding: 2
            }, text(ecs, {
                fontSize: 18
            }, `out ${i}`)),
            container(ecs, {
                width: 5,
                height: 0
            }),
            container(ecs, {
                width: 18,
                height: 18,
                color: new (0, _components.Color)(101, 215, 249, 255),
                onClick: (0, _systems.clickOutput)(graph)
            })
        ])));
const source = container(ecs, {
    color: new (0, _components.Color)(0, 0, 0, 50),
    padding: 10,
    x: 25,
    y: 200,
    onDrag: (0, _systems.drag)
}, column(ecs, {
    crossAxisAlignment: Alignment.CENTER
}, [
    container(ecs, {
        padding: 5
    }, text(ecs, "Source")),
    container(ecs, {
        width: 0,
        height: 10
    }),
    row(ecs, [
        inputs(3),
        container(ecs, {
            width: 30,
            height: 0
        }),
        outputs(2), 
    ]), 
]));
const transform = container(ecs, {
    color: new (0, _components.Color)(0, 0, 0, 50),
    padding: 10,
    x: 300,
    y: 100,
    onDrag: (0, _systems.drag)
}, column(ecs, {
    crossAxisAlignment: Alignment.CENTER
}, [
    container(ecs, {
        padding: 5
    }, text(ecs, "Transform")),
    container(ecs, {
        width: 0,
        height: 10
    }),
    row(ecs, [
        inputs(2),
        container(ecs, {
            width: 30,
            height: 0
        }),
        outputs(4), 
    ])
]));
const sink = container(ecs, {
    color: new (0, _components.Color)(0, 0, 0, 50),
    padding: 10,
    x: 550,
    y: 250,
    onDrag: (0, _systems.drag)
}, column(ecs, {
    crossAxisAlignment: Alignment.CENTER
}, [
    container(ecs, {
        padding: 5
    }, text(ecs, "Sink")),
    container(ecs, {
        width: 0,
        height: 10
    }),
    row(ecs, [
        inputs(3),
        container(ecs, {
            width: 30,
            height: 0
        }),
        outputs(3)
    ])
]));
graph.update((0, _components.Children), (children)=>children.entities.push(source, transform, sink));
const camera = ecs.entity(new Transform((0, _linearAlgebra.Mat3).identity()));
ecs.set(renderer, new UIRoot(root), new (0, _components.Camera)(camera));
init(ecs);
requestAnimationFrame(()=>render(ecs));
document.body.appendChild(renderer.canvas);

},{"./components":"563zL","./linear_algebra":"8TRXG","./studio":"kNHuv","./systems":"d6usx"}],"563zL":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "UIRoot", ()=>UIRoot);
parcelHelpers.export(exports, "Text", ()=>Text);
parcelHelpers.export(exports, "FontSize", ()=>FontSize);
parcelHelpers.export(exports, "FontFamily", ()=>FontFamily);
parcelHelpers.export(exports, "Child", ()=>Child);
parcelHelpers.export(exports, "Children", ()=>Children);
parcelHelpers.export(exports, "Connections", ()=>Connections);
parcelHelpers.export(exports, "Camera", ()=>Camera);
parcelHelpers.export(exports, "Alignment", ()=>Alignment);
parcelHelpers.export(exports, "CrossAxisAlignment", ()=>CrossAxisAlignment);
parcelHelpers.export(exports, "Width", ()=>Width);
parcelHelpers.export(exports, "Height", ()=>Height);
parcelHelpers.export(exports, "Translate", ()=>Translate);
parcelHelpers.export(exports, "Transform", ()=>Transform);
parcelHelpers.export(exports, "Zoom", ()=>Zoom);
parcelHelpers.export(exports, "From", ()=>From);
parcelHelpers.export(exports, "To", ()=>To);
parcelHelpers.export(exports, "Color", ()=>Color);
parcelHelpers.export(exports, "Padding", ()=>Padding);
parcelHelpers.export(exports, "Constraints", ()=>Constraints);
parcelHelpers.export(exports, "Size", ()=>Size);
parcelHelpers.export(exports, "Offset", ()=>Offset);
parcelHelpers.export(exports, "Layout", ()=>Layout);
parcelHelpers.export(exports, "WorldSpace", ()=>WorldSpace);
parcelHelpers.export(exports, "Vertices", ()=>Vertices);
parcelHelpers.export(exports, "TextureCoordinates", ()=>TextureCoordinates);
parcelHelpers.export(exports, "Colors", ()=>Colors);
parcelHelpers.export(exports, "VertexIndices", ()=>VertexIndices);
parcelHelpers.export(exports, "CameraIndices", ()=>CameraIndices);
parcelHelpers.export(exports, "Geometry", ()=>Geometry);
parcelHelpers.export(exports, "OnDrag", ()=>OnDrag);
parcelHelpers.export(exports, "OnClick", ()=>OnClick);
parcelHelpers.export(exports, "Pointers", ()=>Pointers);
parcelHelpers.export(exports, "PointerDistance", ()=>PointerDistance);
parcelHelpers.export(exports, "Dragging", ()=>Dragging);
parcelHelpers.export(exports, "DraggedEntity", ()=>DraggedEntity);
parcelHelpers.export(exports, "ConnectionFrom", ()=>ConnectionFrom);
parcelHelpers.export(exports, "ConnectionTo", ()=>ConnectionTo);
class UIRoot {
    constructor(entity){
        this.entity = entity;
    }
}
class Text {
    constructor(value){
        this.value = value;
    }
}
class FontSize {
    constructor(value){
        this.value = value;
    }
}
class FontFamily {
    constructor(value){
        this.value = value;
    }
}
class Child {
    constructor(entity){
        this.entity = entity;
    }
}
class Children {
    constructor(entities){
        this.entities = entities;
    }
}
class Connections {
    constructor(entities){
        this.entities = entities;
    }
}
class Camera {
    constructor(entity){
        this.entity = entity;
    }
}
let Alignment;
(function(Alignment1) {
    Alignment1[Alignment1["START"] = 0] = "START";
    Alignment1[Alignment1["CENTER"] = 1] = "CENTER";
    Alignment1[Alignment1["END"] = 2] = "END";
})(Alignment || (Alignment = {}));
class CrossAxisAlignment {
    constructor(alignment){
        this.alignment = alignment;
    }
}
class Width {
    constructor(value){
        this.value = value;
    }
}
class Height {
    constructor(value){
        this.value = value;
    }
}
class Translate {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}
class Transform {
    constructor(matrix){
        this.matrix = matrix;
    }
}
class Zoom {
    constructor(scale, x, y){
        this.scale = scale;
        this.x = x;
        this.y = y;
    }
}
class From {
    constructor(entity){
        this.entity = entity;
    }
}
class To {
    constructor(entity){
        this.entity = entity;
    }
}
class Color {
    constructor(r, g, b, a){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}
class Padding {
    constructor(value){
        this.value = value;
    }
}
class Constraints {
    constructor(minWidth, maxWidth, minHeight, maxHeight){
        this.minWidth = minWidth;
        this.maxWidth = maxWidth;
        this.minHeight = minHeight;
        this.maxHeight = maxHeight;
    }
}
class Size {
    constructor(width, height){
        this.width = width;
        this.height = height;
    }
}
class Offset {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.add = (other)=>new Offset(this.x + other.x, this.y + other.y);
    }
}
class Layout {
    constructor(impl){
        this.impl = impl;
        this.layout = (self, constraints)=>this.impl(self, constraints);
    }
}
class WorldSpace {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
class Vertices {
    constructor(data){
        this.data = data;
    }
}
class TextureCoordinates {
    constructor(data){
        this.data = data;
    }
}
class Colors {
    constructor(data){
        this.data = data;
    }
}
class VertexIndices {
    constructor(data){
        this.data = data;
    }
}
class CameraIndices {
    constructor(data){
        this.data = data;
    }
}
class Geometry {
    constructor(impl){
        this.impl = impl;
        this.geometry = (self, parentOffset, layers, z)=>this.impl(self, parentOffset, layers, z);
    }
}
class OnDrag {
    constructor(callback){
        this.callback = callback;
    }
}
class OnClick {
    constructor(callback){
        this.callback = callback;
    }
}
class Pointers {
    constructor(events){
        this.events = events;
    }
}
class PointerDistance {
    constructor(value){
        this.value = value;
    }
}
class Dragging {
    constructor(value){
        this.value = value;
    }
}
class DraggedEntity {
    constructor(entity){
        this.entity = entity;
    }
}
class ConnectionFrom {
    constructor(entity){
        this.entity = entity;
    }
}
class ConnectionTo {
    constructor(entity){
        this.entity = entity;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || dest.hasOwnProperty(key)) return;
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

},{}],"8TRXG":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Vec3", ()=>Vec3);
parcelHelpers.export(exports, "Mat3", ()=>Mat3);
class Vec3 {
    constructor(data){
        this.data = data;
        this.length = ()=>{
            const [a, b, c] = this.data;
            return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2) + Math.pow(c, 2));
        };
    }
}
class Mat3 {
    constructor(data){
        this.data = data;
        this.matMul = (other)=>{
            const a = this.data;
            const b = other.data;
            const a11 = a[0];
            const a12 = a[1];
            const a13 = a[2];
            const a21 = a[3];
            const a22 = a[4];
            const a23 = a[5];
            const a31 = a[6];
            const a32 = a[7];
            const a33 = a[8];
            const b11 = b[0];
            const b12 = b[1];
            const b13 = b[2];
            const b21 = b[3];
            const b22 = b[4];
            const b23 = b[5];
            const b31 = b[6];
            const b32 = b[7];
            const b33 = b[8];
            const c11 = a11 * b11 + a12 * b21 + a13 * b31;
            const c12 = a11 * b12 + a12 * b22 + a13 * b32;
            const c13 = a11 * b13 + a12 * b23 + a13 * b33;
            const c21 = a21 * b11 + a22 * b21 + a23 * b31;
            const c22 = a21 * b12 + a22 * b22 + a23 * b32;
            const c23 = a21 * b13 + a22 * b23 + a23 * b33;
            const c31 = a31 * b11 + a32 * b21 + a33 * b31;
            const c32 = a31 * b12 + a32 * b22 + a33 * b32;
            const c33 = a31 * b13 + a32 * b23 + a33 * b33;
            return new Mat3([
                c11,
                c12,
                c13,
                c21,
                c22,
                c23,
                c31,
                c32,
                c33, 
            ]);
        };
        this.vecMul = (other)=>{
            const a = this.data;
            const b = other.data;
            const a11 = a[0];
            const a12 = a[1];
            const a13 = a[2];
            const a21 = a[3];
            const a22 = a[4];
            const a23 = a[5];
            const a31 = a[6];
            const a32 = a[7];
            const a33 = a[8];
            const b1 = b[0];
            const b2 = b[1];
            const b3 = b[2];
            const c1 = a11 * b1 + a12 * b2 + a13 * b3;
            const c2 = a21 * b1 + a22 * b2 + a23 * b3;
            const c3 = a31 * b1 + a32 * b2 + a33 * b3;
            return new Vec3([
                c1,
                c2,
                c3
            ]);
        };
        this.inverse = ()=>{
            const a = this.data;
            const a11 = a[0];
            const a12 = a[1];
            const a13 = a[2];
            const a21 = a[3];
            const a22 = a[4];
            const a23 = a[5];
            const a31 = a[6];
            const a32 = a[7];
            const a33 = a[8];
            const b11 = a22 * a33 - a23 * a32;
            const b12 = a21 * a33 - a23 * a31;
            const b13 = a21 * a32 - a22 * a31;
            const b21 = a12 * a33 - a13 * a32;
            const b22 = a11 * a33 - a13 * a31;
            const b23 = a11 * a32 - a12 * a31;
            const b31 = a12 * a23 - a13 * a22;
            const b32 = a11 * a23 - a13 * a21;
            const b33 = a11 * a22 - a12 * a21;
            const det = a31 * b31 - a32 * b32 + a33 * b33;
            const idet = 1 / det;
            return new Mat3([
                idet * b11,
                idet * -b21,
                idet * b31,
                idet * -b12,
                idet * b22,
                idet * -b32,
                idet * b13,
                idet * -b23,
                idet * b33
            ]);
        };
    }
    static identity = ()=>new Mat3([
            1,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            1, 
        ]);
    static projection = (width, height)=>new Mat3([
            2 / width,
            0,
            -1,
            0,
            -2 / height,
            1,
            0,
            0,
            1
        ]);
    static translation = (x, y)=>new Mat3([
            1,
            0,
            x,
            0,
            1,
            y,
            0,
            0,
            1
        ]);
    static rotation = (radians)=>{
        const c = Math.cos(radians);
        const s = Math.sin(radians);
        return new Mat3([
            c,
            s,
            0,
            -s,
            c,
            0,
            0,
            0,
            1
        ]);
    };
    static scaling = (x, y)=>new Mat3([
            x,
            0,
            0,
            0,
            y,
            0,
            0,
            0,
            1
        ]);
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"kNHuv":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "ECS", ()=>(0, _ecs.ECS));
parcelHelpers.export(exports, "Entity", ()=>(0, _ecs.Entity));
parcelHelpers.export(exports, "Renderer", ()=>(0, _renderer.Renderer));
parcelHelpers.export(exports, "systems", ()=>_systems);
parcelHelpers.export(exports, "components", ()=>_components);
parcelHelpers.export(exports, "ui", ()=>_ui);
parcelHelpers.export(exports, "Layers", ()=>(0, _layers.Layers));
parcelHelpers.export(exports, "linear_algebra", ()=>_linearAlgebra);
var _systems = require("./systems");
var _components = require("./components");
var _ui = require("./ui");
var _linearAlgebra = require("./linear_algebra");
var _ecs = require("./ecs");
var _renderer = require("./renderer");
var _layers = require("./layers");

},{"./systems":"d6usx","./components":"563zL","./ui":"cOWCo","./linear_algebra":"8TRXG","./ecs":"bCZLy","./renderer":"g6IVn","./layers":"lQrZT","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"d6usx":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "render", ()=>(0, _render.render));
parcelHelpers.export(exports, "layout", ()=>(0, _layout.layout));
parcelHelpers.export(exports, "geometry", ()=>(0, _geometry.geometry));
parcelHelpers.export(exports, "rayCast", ()=>(0, _rayCast.rayCast));
parcelHelpers.export(exports, "init", ()=>(0, _init.init));
parcelHelpers.export(exports, "pointerDown", ()=>(0, _pointerDown.pointerDown));
parcelHelpers.export(exports, "pointerMove", ()=>(0, _pointerMove.pointerMove));
parcelHelpers.export(exports, "pointerUp", ()=>(0, _pointerUp.pointerUp));
parcelHelpers.export(exports, "clickInput", ()=>(0, _clickInput.clickInput));
parcelHelpers.export(exports, "clickOutput", ()=>(0, _clickOutput.clickOutput));
parcelHelpers.export(exports, "drag", ()=>(0, _drag.drag));
var _render = require("./render");
var _layout = require("./layout");
var _geometry = require("./geometry");
var _rayCast = require("./ray_cast");
var _init = require("./init");
var _pointerDown = require("./pointerDown");
var _pointerMove = require("./pointerMove");
var _pointerUp = require("./pointerUp");
var _clickInput = require("./clickInput");
var _clickOutput = require("./clickOutput");
var _drag = require("./drag");

},{"./render":"b41K2","./layout":"2ijEg","./geometry":"gw50k","./ray_cast":"ganwk","./init":"dm9Tk","./pointerDown":"7vvuK","./pointerMove":"7cq31","./pointerUp":"8OvPx","./clickInput":"iwKcW","./clickOutput":"FNPLR","./drag":"6YoP9","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"b41K2":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "render", ()=>render);
var _renderer = require("../renderer");
var _components = require("../components");
var _ = require("./");
var _linearAlgebra = require("../linear_algebra");
const renderTriangles = (renderer, layers)=>{
    const { gl  } = renderer;
    let vertices = [];
    let colors = [];
    let textureCoordinates = [];
    let vertexIndices = [];
    let previousTexture = -1;
    for (const layer of layers.layers)for (const [texture, entities] of layer){
        if (texture !== previousTexture) {
            if (vertices.length) {
                renderer.draw({
                    vertices,
                    colors,
                    textureCoordinates,
                    vertexIndices
                });
                vertices = [];
                colors = [];
                textureCoordinates = [];
                vertexIndices = [];
            }
            previousTexture = texture;
            gl.bindTexture(gl.TEXTURE_2D, renderer.textures[texture]);
        }
        for (const entity of entities){
            const offset = vertices.length / 2;
            vertices.push(...entity.get((0, _components.Vertices)).data);
            colors.push(...entity.get((0, _components.Colors)).data);
            textureCoordinates.push(...entity.get((0, _components.TextureCoordinates)).data);
            for (const index of entity.get((0, _components.VertexIndices)).data)vertexIndices.push(offset + index);
        }
    }
    if (vertices.length === 0) return;
    renderer.draw({
        vertices,
        colors,
        textureCoordinates,
        vertexIndices
    });
};
const renderLines = (renderer, layers)=>{
    const { gl  } = renderer;
    let vertices = [];
    let colors = [];
    let textureCoordinates = [];
    gl.bindTexture(gl.TEXTURE_2D, renderer.textures[0]);
    for (const entity of layers.lines){
        vertices.push(...entity.get((0, _components.Vertices)).data);
        colors.push(...entity.get((0, _components.Colors)).data);
        textureCoordinates.push(...entity.get((0, _components.TextureCoordinates)).data);
    }
    if (vertices.length === 0) return;
    renderer.drawLines({
        vertices,
        colors,
        textureCoordinates
    });
};
const render = (ecs)=>{
    const root = ecs.get((0, _components.UIRoot)).entity;
    (0, _.layout)(root);
    const layers = (0, _.geometry)(root);
    const renderer = ecs.get((0, _renderer.Renderer));
    const projection = (0, _linearAlgebra.Mat3).projection(renderer.width, renderer.height);
    const camera = ecs.get((0, _components.Camera)).entity.get((0, _components.Transform)).matrix;
    renderer.setMatrix(projection.matMul(camera.inverse()));
    renderer.clear();
    renderTriangles(renderer, layers);
    renderLines(renderer, layers);
    ecs.set(layers);
};

},{"../renderer":"g6IVn","../components":"563zL","./":"d6usx","../linear_algebra":"8TRXG","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"g6IVn":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Renderer", ()=>Renderer);
class DefaultProgram {
    constructor(gl){
        const aPositionLocation = 0;
        const aTextureCoordinatesLocation = 1;
        const aColorLocation = 2;
        const vertexShaderSource = `#version 300 es
  uniform float u_devicePixelRatio;
  uniform mat3 u_matrix;

  layout(location = ${aPositionLocation}) in vec2 a_position;
  layout(location = ${aTextureCoordinatesLocation}) in vec2 a_textureCoordinates;
  layout(location = ${aColorLocation}) in vec4 a_color;

  out vec2 v_textureCoordinates;
  out vec4 v_color;

  void main() {
    gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
    v_textureCoordinates = a_textureCoordinates * u_devicePixelRatio;
    v_color = a_color / 255.0;
  }
  `;
        const fragmentShaderSource = `#version 300 es
  precision highp float;

  uniform sampler2D u_texture;

  in vec2 v_textureCoordinates;
  in vec4 v_color;

  out vec4 fragColor;
  
  void main() {
    ivec2 size = textureSize(u_texture, 0);
    vec2 coordinate = v_textureCoordinates / vec2(float(size.x), float(size.y));
    fragColor = texture(u_texture, coordinate) * v_color;
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
        const vertexArrayObject = gl.createVertexArray();
        gl.bindVertexArray(vertexArrayObject);
        this.positionBuffer = gl.createBuffer();
        gl.bindAttribLocation(program, aPositionLocation, "a_position");
        gl.enableVertexAttribArray(aPositionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(aPositionLocation, /*size*/ 2, /*type*/ gl.FLOAT, /*normalize*/ false, /*stride*/ 0, /*offset*/ 0);
        this.textureCoordinatesBuffer = gl.createBuffer();
        gl.bindAttribLocation(program, aTextureCoordinatesLocation, "a_textureCoordinates");
        gl.enableVertexAttribArray(aTextureCoordinatesLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordinatesBuffer);
        gl.vertexAttribPointer(aTextureCoordinatesLocation, /*size*/ 2, /*type*/ gl.FLOAT, /*normalize*/ false, /*stride*/ 0, /*offset*/ 0);
        this.colorBuffer = gl.createBuffer();
        gl.bindAttribLocation(program, aColorLocation, "a_color");
        gl.enableVertexAttribArray(aColorLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(aColorLocation, /*size*/ 4, /*type*/ gl.FLOAT, /*normalize*/ false, /*stride*/ 0, /*offset*/ 0);
        this.indexBuffer = gl.createBuffer();
        this.devicePixelRatioLocation = gl.getUniformLocation(program, "u_devicePixelRatio");
        this.matrixLocation = gl.getUniformLocation(program, "u_matrix");
    }
}
const nearestPowerOfTwo = (x)=>{
    let current = 1;
    while(current < x)current <<= 1;
    return current;
};
class FontAtlas {
    constructor(texture, metrics, fontFamily, fontSize){
        this.texture = texture;
        this.metrics = metrics;
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
        this.metric = (c)=>this.metrics[c.charCodeAt(0)];
    }
}
const createFontMetrics = (gl, texture, font, fontSize)=>{
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const totalCells = 256;
    const rows = Math.sqrt(totalCells);
    const size = nearestPowerOfTwo(fontSize * rows);
    const cellSize = size / rows;
    canvas.width = size * window.devicePixelRatio;
    canvas.height = size * window.devicePixelRatio;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = font;
    ctx.fillStyle = "white";
    const ascii = Array.from({
        length: totalCells
    }, (v, i)=>i);
    const chars = ascii.map((c)=>String.fromCharCode(c));
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const metrics = chars.map((c, i)=>{
        const metric = ctx.measureText(c);
        const width = Math.ceil(metric.width);
        const height = fontSize;
        const x = i % rows * cellSize;
        const y = Math.floor(i / rows) * cellSize;
        ctx.fillText(c, x, y);
        return {
            x: x,
            y: y,
            width: width,
            height: height
        };
    });
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, /*mipLevel*/ 0, /*internalformat*/ gl.RGBA, /*srcFormat*/ gl.RGBA, /*srcType*/ gl.UNSIGNED_BYTE, /*source*/ canvas);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return metrics;
};
class Renderer {
    constructor(width, height){
        const canvas = document.createElement("canvas");
        canvas.style.touchAction = "none";
        const gl = canvas.getContext("webgl2");
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.depthMask(false);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.activeTexture(gl.TEXTURE0);
        this.gl = gl;
        this.canvas = canvas;
        this.program = new DefaultProgram(gl);
        this.fontAtlasses = new Map();
        this.textures = [];
        this.devicePixelRatio = window.devicePixelRatio;
        this.setSize(width, height);
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, /*mipLevel*/ 0, /*internalformat*/ gl.RGBA, /*width*/ 1, /*height*/ 1, /*border*/ 0, /*srcFormat*/ gl.RGBA, /*srcType*/ gl.UNSIGNED_BYTE, /*data*/ new Uint8Array([
            255,
            255,
            255,
            255
        ]));
        this.textures.push(texture);
    }
    setSize = (width, height)=>{
        const { gl , canvas  } = this;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        gl.uniform2f(this.program.resolutionLocation, canvas.width, canvas.height);
        gl.uniform1f(this.program.devicePixelRatioLocation, window.devicePixelRatio);
        gl.viewport(0, 0, canvas.width, canvas.height);
        this.width = width;
        this.height = height;
        if (this.devicePixelRatio === window.devicePixelRatio) return;
        this.devicePixelRatio = window.devicePixelRatio;
        this.recreateFontAtlasses();
    };
    clear = ()=>{
        const { gl  } = this;
        gl.clear(gl.COLOR_BUFFER_BIT);
    };
    setMatrix = (matrix)=>this.gl.uniformMatrix3fv(this.program.matrixLocation, /*transpose*/ true, /*data*/ matrix.data);
    draw = ({ vertices , colors , textureCoordinates , vertexIndices  })=>{
        const { gl , program  } = this;
        gl.bindBuffer(gl.ARRAY_BUFFER, program.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, program.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, program.textureCoordinatesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, program.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
        gl.drawElements(gl.TRIANGLES, /*count*/ vertexIndices.length, /*type*/ gl.UNSIGNED_SHORT, /*offset*/ 0);
    };
    drawLines = ({ vertices , colors , textureCoordinates  })=>{
        const { gl , program  } = this;
        gl.bindBuffer(gl.ARRAY_BUFFER, program.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, program.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, program.textureCoordinatesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, program.indexBuffer);
        gl.drawArrays(gl.LINES, 0, vertices.length / 2);
    };
    recreateFontAtlasses = ()=>{
        for (const [font, fontAtlas] of this.fontAtlasses){
            const texture = this.textures[fontAtlas.texture];
            const metrics = createFontMetrics(this.gl, texture, font, fontAtlas.fontSize);
            fontAtlas.metrics = metrics;
        }
    };
    fontAtlas = (fontFamily, fontSize)=>{
        const font = `${fontSize}px ${fontFamily}`;
        const atlas = this.fontAtlasses.get(font);
        if (atlas) return atlas;
        const { gl  } = this;
        const texture = gl.createTexture();
        const metrics = createFontMetrics(gl, texture, font, fontSize);
        const textureIndex = this.textures.length;
        this.textures.push(texture);
        const newAtlas = new FontAtlas(textureIndex, metrics, fontFamily, fontSize);
        this.fontAtlasses.set(font, newAtlas);
        return newAtlas;
    };
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"2ijEg":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "layout", ()=>layout);
var _components = require("../components");
var _renderer = require("../renderer");
const layout = (root)=>{
    const { width , height  } = root.ecs.get((0, _renderer.Renderer));
    const constraints = new (0, _components.Constraints)(0, width, 0, height);
    root.get((0, _components.Layout)).layout(root, constraints);
};

},{"../components":"563zL","../renderer":"g6IVn","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gw50k":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "geometry", ()=>geometry);
var _components = require("../components");
var _layers = require("../layers");
const geometry = (root)=>{
    const layers = new (0, _layers.Layers)();
    root.get((0, _components.Geometry)).geometry(root, new (0, _components.Offset)(0, 0), layers, 0);
    return layers;
};

},{"../components":"563zL","../layers":"lQrZT","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"lQrZT":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Layers", ()=>Layers);
class Layers {
    constructor(){
        this.layers = [];
        this.lines = [];
    }
    push = ({ z , texture , entity  })=>{
        for(let i = this.layers.length; i < z + 1; ++i)this.layers.push(new Map());
        const layer = this.layers[z];
        const entities = layer.get(texture);
        if (entities) {
            entities.push(entity);
            return;
        }
        layer.set(texture, [
            entity
        ]);
    };
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"ganwk":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "rayCast", ()=>rayCast);
var _components = require("../components");
var _layers = require("../layers");
function* rayCast(ecs, camera, vec) {
    const [mx, my, _] = camera.vecMul(vec).data;
    for (const layer of ecs.get((0, _layers.Layers)).layers.reverse()){
        for (const entities of layer.values())for (const entity of entities){
            const { x , y , width , height  } = entity.get((0, _components.WorldSpace));
            if (mx > x && mx < x + width && my > y && my < y + height) yield entity;
        }
    }
}

},{"../components":"563zL","../layers":"lQrZT","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"dm9Tk":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "init", ()=>init);
var _components = require("../components");
var _pointerDown = require("./pointerDown");
var _pointerMove = require("./pointerMove");
var _pointerUp = require("./pointerUp");
var _resize = require("./resize");
var _touchEnd = require("./touchEnd");
var _wheel = require("./wheel");
const init = (ecs)=>{
    ecs.set(new (0, _components.Pointers)([]), new (0, _components.PointerDistance)(0), new (0, _components.Dragging)(false), new (0, _components.DraggedEntity)(null), new (0, _components.ConnectionFrom)(null), new (0, _components.ConnectionTo)(null));
    (0, _pointerDown.pointerDown)(ecs);
    (0, _pointerMove.pointerMove)(ecs);
    (0, _pointerUp.pointerUp)(ecs);
    (0, _resize.resize)(ecs);
    (0, _touchEnd.touchEnd)(ecs);
    (0, _wheel.wheel)(ecs);
};

},{"../components":"563zL","./pointerDown":"7vvuK","./pointerMove":"7cq31","./pointerUp":"8OvPx","./resize":"hlf0k","./touchEnd":"e8IaL","./wheel":"kpX46","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"7vvuK":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "pointerDown", ()=>pointerDown);
var _components = require("../components");
var _linearAlgebra = require("../linear_algebra");
var _rayCast = require("./ray_cast");
var _render = require("./render");
const pointerDown = (ecs)=>{
    document.addEventListener("pointerdown", (e)=>{
        const length = ecs.update((0, _components.Pointers), (pointers)=>{
            pointers.events.push(e);
            return pointers.events.length;
        });
        if (length !== 1) return;
        const camera = ecs.get((0, _components.Camera)).entity;
        const cameraMatrix = camera.get((0, _components.Transform)).matrix;
        const mouse = new (0, _linearAlgebra.Vec3)([
            e.clientX,
            e.clientY,
            1
        ]);
        for (const entity of (0, _rayCast.rayCast)(ecs, cameraMatrix, mouse)){
            const onClick = entity.get((0, _components.OnClick));
            if (onClick) {
                onClick.callback(entity);
                requestAnimationFrame(()=>(0, _render.render)(ecs));
                return;
            }
        }
        ecs.update((0, _components.Dragging), (dragging)=>dragging.value = true);
    });
};

},{"../components":"563zL","../linear_algebra":"8TRXG","./ray_cast":"ganwk","./render":"b41K2","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"7cq31":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "pointerMove", ()=>pointerMove);
var _components = require("../components");
var _linearAlgebra = require("../linear_algebra");
var _rayCast = require("./ray_cast");
var _render = require("./render");
const dragging = (ecs, e, movementX, movementY)=>{
    const camera = ecs.get((0, _components.Camera)).entity;
    const draggedEntity = ecs.get((0, _components.DraggedEntity)).entity;
    if (draggedEntity) {
        const onDrag = draggedEntity.get((0, _components.OnDrag)).callback;
        const scaling = camera.get((0, _components.Transform)).matrix.vecMul(new (0, _linearAlgebra.Vec3)([
            0,
            1,
            0
        ])).length();
        onDrag(draggedEntity, movementX * scaling, movementY * scaling);
        requestAnimationFrame(()=>(0, _render.render)(ecs));
        return;
    }
    const cameraMatrix = camera.get((0, _components.Transform)).matrix;
    const mouse = new (0, _linearAlgebra.Vec3)([
        e.clientX,
        e.clientY,
        1
    ]);
    for (const entity of (0, _rayCast.rayCast)(ecs, cameraMatrix, mouse)){
        const onDrag = entity.get((0, _components.OnDrag));
        if (onDrag) {
            ecs.update((0, _components.DraggedEntity), (dragged)=>dragged.entity = entity);
            const scaling = camera.get((0, _components.Transform)).matrix.vecMul(new (0, _linearAlgebra.Vec3)([
                0,
                1,
                0
            ])).length();
            onDrag.callback(entity, movementX * scaling, movementY * scaling);
            requestAnimationFrame(()=>(0, _render.render)(ecs));
            return;
        }
    }
    camera.update((0, _components.Transform), (transform)=>{
        const translate = (0, _linearAlgebra.Mat3).translation(-movementX, -movementY);
        transform.matrix = transform.matrix.matMul(translate);
    });
    requestAnimationFrame(()=>(0, _render.render)(ecs));
};
const zoomCamera = (ecs, pointers, e)=>{
    const [x1, y1] = [
        pointers[0].clientX,
        pointers[0].clientY
    ];
    const [x2, y2] = [
        pointers[1].clientX,
        pointers[1].clientY
    ];
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const pointerDistance = ecs.get((0, _components.PointerDistance)).value;
    if (pointerDistance > 0) {
        const move = (0, _linearAlgebra.Mat3).translation(e.clientX, e.clientY);
        const zoom = Math.pow(2, (pointerDistance - distance) * 0.01);
        const scale = (0, _linearAlgebra.Mat3).scaling(zoom, zoom);
        const moveBack = (0, _linearAlgebra.Mat3).translation(-e.clientX, -e.clientY);
        const result = move.matMul(scale).matMul(moveBack);
        const camera = ecs.get((0, _components.Camera)).entity;
        camera.update((0, _components.Transform), (transform)=>transform.matrix = transform.matrix.matMul(result));
    }
    ecs.update((0, _components.PointerDistance), (d)=>d.value = distance);
    requestAnimationFrame(()=>(0, _render.render)(ecs));
};
const onPointerMove = (ecs, e)=>{
    const pointers = ecs.get((0, _components.Pointers)).events;
    const index = pointers.findIndex((p)=>p.pointerId === e.pointerId);
    if (index === -1) return;
    const movementX = e.clientX - pointers[index].clientX;
    const movementY = e.clientY - pointers[index].clientY;
    pointers[index] = e;
    if (ecs.get((0, _components.Dragging)).value && pointers.length === 1) dragging(ecs, e, movementX, movementY);
    else if (pointers.length === 2) zoomCamera(ecs, pointers, e);
};
const pointerMove = (ecs)=>{
    if (typeof PointerEvent.prototype.getCoalescedEvents === "function") document.addEventListener("pointermove", (e)=>e.getCoalescedEvents().forEach((p)=>onPointerMove(ecs, p)));
    else document.addEventListener("pointermove", (e)=>onPointerMove(ecs, e));
};

},{"../components":"563zL","../linear_algebra":"8TRXG","./ray_cast":"ganwk","./render":"b41K2","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"8OvPx":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "pointerUp", ()=>pointerUp);
var _components = require("../components");
const pointerUp = (ecs)=>{
    document.addEventListener("pointerup", (e)=>{
        const length = ecs.update((0, _components.Pointers), (pointers)=>{
            pointers.events.splice(pointers.events.findIndex((p)=>p.pointerId === e.pointerId), 1);
            return pointers.events.length;
        });
        if (length !== 0) return;
        ecs.update((0, _components.Dragging), (dragging)=>dragging.value = false);
        ecs.update((0, _components.PointerDistance), (distance)=>distance.value = 0);
        ecs.update((0, _components.DraggedEntity), (dragged)=>dragged.entity = null);
    });
};

},{"../components":"563zL","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"hlf0k":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "resize", ()=>resize);
var _renderer = require("../renderer");
var _render = require("./render");
const resize = (ecs)=>{
    const renderer = ecs.get((0, _renderer.Renderer));
    window.addEventListener("resize", ()=>{
        renderer.setSize(renderer.canvas.clientWidth, renderer.canvas.clientHeight);
        requestAnimationFrame(()=>(0, _render.render)(ecs));
    });
};

},{"../renderer":"g6IVn","./render":"b41K2","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"e8IaL":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "touchEnd", ()=>touchEnd);
var _renderer = require("../renderer");
const touchEnd = (ecs)=>{
    const renderer = ecs.get((0, _renderer.Renderer));
    document.addEventListener("touchend", ()=>{
        renderer.canvas.requestFullscreen();
    });
};

},{"../renderer":"g6IVn","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"kpX46":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "wheel", ()=>wheel);
var _components = require("../components");
var _linearAlgebra = require("../linear_algebra");
var _render = require("./render");
const wheel = (ecs)=>{
    document.addEventListener("wheel", (e)=>{
        const camera = ecs.get((0, _components.Camera)).entity;
        e.preventDefault();
        camera.update((0, _components.Transform), (transform)=>{
            const move = (0, _linearAlgebra.Mat3).translation(e.clientX, e.clientY);
            const zoom = Math.pow(2, e.deltaY * 0.01);
            const scale = (0, _linearAlgebra.Mat3).scaling(zoom, zoom);
            const moveBack = (0, _linearAlgebra.Mat3).translation(-e.clientX, -e.clientY);
            const result = move.matMul(scale).matMul(moveBack);
            transform.matrix = transform.matrix.matMul(result);
        });
        requestAnimationFrame(()=>(0, _render.render)(ecs));
    }, {
        passive: false
    });
};

},{"../components":"563zL","../linear_algebra":"8TRXG","./render":"b41K2","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"iwKcW":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "clickInput", ()=>clickInput);
var _components = require("../components");
var _ui = require("../ui");
var _render = require("./render");
const clickInput = (graph)=>(entity)=>{
        const ecs = entity.ecs;
        const connectionTo = ecs.get((0, _components.ConnectionTo)).entity;
        const connectionFrom = ecs.get((0, _components.ConnectionFrom)).entity;
        if (!connectionFrom) {
            if (connectionTo === entity) return;
            else if (connectionTo !== null) connectionTo.set(new (0, _components.Color)(101, 215, 249, 255));
            ecs.update((0, _components.ConnectionTo), (to)=>to.entity = entity);
            entity.set(new (0, _components.Color)(67, 76, 112, 255));
            requestAnimationFrame(()=>(0, _render.render)(ecs));
        } else {
            const con = (0, _ui.connection)(ecs, {
                from: connectionFrom,
                to: entity
            });
            graph.update((0, _components.Connections), (connections)=>connections.entities.push(con));
            connectionFrom.set(new (0, _components.Color)(101, 215, 249, 255));
            ecs.update((0, _components.ConnectionFrom), (from)=>from.entity = null);
            requestAnimationFrame(()=>(0, _render.render)(ecs));
        }
    };

},{"../components":"563zL","../ui":"cOWCo","./render":"b41K2","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"cOWCo":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "text", ()=>(0, _text.text));
parcelHelpers.export(exports, "center", ()=>(0, _center.center));
parcelHelpers.export(exports, "column", ()=>(0, _column.column));
parcelHelpers.export(exports, "row", ()=>(0, _row.row));
parcelHelpers.export(exports, "container", ()=>(0, _container.container));
parcelHelpers.export(exports, "scene", ()=>(0, _scene.scene));
parcelHelpers.export(exports, "stack", ()=>(0, _stack.stack));
parcelHelpers.export(exports, "connection", ()=>(0, _connection.connection));
var _text = require("./text");
var _center = require("./center");
var _column = require("./column");
var _row = require("./row");
var _container = require("./container");
var _scene = require("./scene");
var _stack = require("./stack");
var _connection = require("./connection");

},{"./text":"6jNj8","./center":"iGT29","./column":"h1BCG","./row":"hjMl0","./container":"1RkTm","./scene":"hsfX6","./stack":"lfhKB","./connection":"j3u17","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"6jNj8":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "text", ()=>text);
var _components = require("../components");
var _renderer = require("../renderer");
const textSize = (renderer, entity)=>{
    const text1 = entity.get((0, _components.Text)).value;
    const fontSize = entity.get((0, _components.FontSize)).value;
    const fontFamily = entity.get((0, _components.FontFamily)).value;
    const atlas = renderer.fontAtlas(fontFamily, fontSize);
    let size = new (0, _components.Size)(0, 0);
    for (const c of text1){
        const metric = atlas.metric(c);
        size.width += metric.width;
        size.height = Math.max(metric.height, size.height);
    }
    return size;
};
const textGeometry = (renderer, entity, offset)=>{
    const text2 = entity.get((0, _components.Text)).value;
    const fontSize = entity.get((0, _components.FontSize)).value;
    const fontFamily = entity.get((0, _components.FontFamily)).value;
    const { r , g , b , a  } = entity.get((0, _components.Color));
    const atlas = renderer.fontAtlas(fontFamily, fontSize);
    let x = 0;
    let indexOffset = 0;
    const vertices = [];
    const textureCoordinates = [];
    const colors = [];
    const indices = [];
    for (const c of text2){
        const metric = atlas.metric(c);
        const x0 = offset.x + x;
        const x1 = x0 + metric.width;
        const y0 = offset.y;
        const y1 = y0 + metric.height;
        vertices.push(x0, y0, x0, y1, x1, y0, x1, y1);
        textureCoordinates.push(metric.x, metric.y, metric.x, metric.y + metric.height, metric.x + metric.width, metric.y, metric.x + metric.width, metric.y + metric.height);
        colors.push(r, g, b, a, r, g, b, a, r, g, b, a, r, g, b, a);
        indices.push(indexOffset + 0, indexOffset + 1, indexOffset + 2, indexOffset + 1, indexOffset + 2, indexOffset + 3);
        x += metric.width;
        indexOffset += 4;
    }
    entity.set(new (0, _components.Vertices)(vertices), new (0, _components.TextureCoordinates)(textureCoordinates), new (0, _components.Colors)(colors), new (0, _components.VertexIndices)(indices));
    return atlas.texture;
};
const layout = (self, constraints)=>{
    const size = textSize(self.ecs.get((0, _renderer.Renderer)), self);
    self.set(constraints, size, new (0, _components.Offset)(0, 0));
    return size;
};
const geometry = (self, parentOffset, layers, z)=>{
    const { width , height  } = self.get((0, _components.Size));
    const offset = parentOffset.add(self.get((0, _components.Offset)));
    const texture = textGeometry(self.ecs.get((0, _renderer.Renderer)), self, offset);
    layers.push({
        z,
        entity: self,
        texture
    });
    self.set(new (0, _components.WorldSpace)(offset.x, offset.y, width, height));
};
const text = (ecs, ...args)=>{
    const [properties, data] = (()=>{
        if (typeof args[0] === "string") return [
            {},
            args[0]
        ];
        return [
            args[0],
            args[1]
        ];
    })();
    return ecs.entity(new (0, _components.Text)(data), new (0, _components.FontSize)(properties.fontSize ?? 24), new (0, _components.FontFamily)(properties.fontFamily ?? "monospace"), properties.color ?? new (0, _components.Color)(255, 255, 255, 255), new (0, _components.Layout)(layout), new (0, _components.Geometry)(geometry));
};

},{"../components":"563zL","../renderer":"g6IVn","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"iGT29":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "center", ()=>center);
var _components = require("../components");
const layout = (self, constraints)=>{
    const child = self.get((0, _components.Child)).entity;
    const childSize = child.get((0, _components.Layout)).layout(child, constraints);
    child.update((0, _components.Offset), (offset)=>{
        offset.x = constraints.maxWidth / 2 - childSize.width / 2;
        offset.y = constraints.maxHeight / 2 - childSize.height / 2;
    });
    const size = new (0, _components.Size)(constraints.maxWidth, constraints.maxHeight);
    self.set(constraints, size, new (0, _components.Offset)(0, 0));
    return size;
};
const geometry = (self, parentOffset, layers, z)=>{
    const { width , height  } = self.get((0, _components.Size));
    const offset = parentOffset.add(self.get((0, _components.Offset)));
    const child = self.get((0, _components.Child)).entity;
    child.get((0, _components.Geometry)).geometry(child, offset, layers, z);
    self.set(new (0, _components.WorldSpace)(offset.x, offset.y, width, height));
};
const center = (ecs, child)=>ecs.entity(new (0, _components.Layout)(layout), new (0, _components.Geometry)(geometry), new (0, _components.Child)(child));

},{"../components":"563zL","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"h1BCG":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "column", ()=>column);
var _components = require("../components");
const layout = (self, constraints)=>{
    let width = 0;
    let height = 0;
    const children = self.get((0, _components.Children)).entities;
    for (const child of children){
        const size = child.get((0, _components.Layout)).layout(child, constraints);
        child.update((0, _components.Offset), (offset)=>offset.y = height);
        height += size.height;
        width = Math.max(width, size.width);
    }
    switch(self.get((0, _components.CrossAxisAlignment)).alignment){
        case (0, _components.Alignment).START:
            break;
        case (0, _components.Alignment).CENTER:
            for (const child1 of children){
                const childWidth = child1.get((0, _components.Size)).width;
                child1.update((0, _components.Offset), (offset)=>offset.x = width / 2 - childWidth / 2);
            }
            break;
        case (0, _components.Alignment).END:
            for (const child2 of children){
                const childWidth = child2.get((0, _components.Size)).width;
                child2.update((0, _components.Offset), (offset)=>offset.x = width - childWidth);
            }
            break;
    }
    const size = new (0, _components.Size)(width, height);
    self.set(constraints, size, new (0, _components.Offset)(0, 0));
    return size;
};
const geometry = (self, parentOffset, layers, z)=>{
    const { width , height  } = self.get((0, _components.Size));
    const offset = parentOffset.add(self.get((0, _components.Offset)));
    for (const child of self.get((0, _components.Children)).entities)child.get((0, _components.Geometry)).geometry(child, offset, layers, z);
    self.set(new (0, _components.WorldSpace)(offset.x, offset.y, width, height));
};
const column = (ecs, ...args)=>{
    const [properties, children] = (()=>{
        if (args[0] instanceof Array) return [
            {},
            args[0]
        ];
        return [
            args[0],
            args[1]
        ];
    })();
    return ecs.entity(new (0, _components.Layout)(layout), new (0, _components.Geometry)(geometry), new (0, _components.Children)(children), new (0, _components.CrossAxisAlignment)(properties.crossAxisAlignment ?? (0, _components.Alignment).START));
};

},{"../components":"563zL","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"hjMl0":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "row", ()=>row);
var _components = require("../components");
const layout = (self, constraints)=>{
    let width = 0;
    let height = 0;
    const children = self.get((0, _components.Children)).entities;
    for (const child of children){
        const size = child.get((0, _components.Layout)).layout(child, constraints);
        child.update((0, _components.Offset), (offset)=>offset.x = width);
        width += size.width;
        height = Math.max(height, size.height);
    }
    switch(self.get((0, _components.CrossAxisAlignment)).alignment){
        case (0, _components.Alignment).START:
            break;
        case (0, _components.Alignment).CENTER:
            for (const child1 of children){
                const childHeight = child1.get((0, _components.Size)).height;
                child1.update((0, _components.Offset), (offset)=>offset.y = height / 2 - childHeight / 2);
            }
            break;
        case (0, _components.Alignment).END:
            for (const child2 of children){
                const childHeight = child2.get((0, _components.Size)).height;
                child2.update((0, _components.Offset), (offset)=>offset.y = height - childHeight);
            }
            break;
    }
    const size = new (0, _components.Size)(width, height);
    self.set(constraints, size, new (0, _components.Offset)(0, 0));
    return size;
};
const geometry = (self, parentOffset, layers, z)=>{
    const { width , height  } = self.get((0, _components.Size));
    const offset = parentOffset.add(self.get((0, _components.Offset)));
    for (const child of self.get((0, _components.Children)).entities)child.get((0, _components.Geometry)).geometry(child, offset, layers, z);
    self.set(new (0, _components.WorldSpace)(offset.x, offset.y, width, height));
};
const row = (ecs, ...args)=>{
    const [properties, children] = (()=>{
        if (args[0] instanceof Array) return [
            {},
            args[0]
        ];
        return [
            args[0],
            args[1]
        ];
    })();
    return ecs.entity(new (0, _components.Layout)(layout), new (0, _components.Geometry)(geometry), new (0, _components.Children)(children), new (0, _components.CrossAxisAlignment)(properties.crossAxisAlignment ?? (0, _components.Alignment).START));
};

},{"../components":"563zL","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"1RkTm":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "container", ()=>container);
var _components = require("../components");
const layout = (self, constraints)=>{
    const padding = self.get((0, _components.Padding)).value;
    const child = self.get((0, _components.Child));
    const { x , y  } = self.get((0, _components.Translate));
    const offset1 = new (0, _components.Offset)(x, y);
    if (child) {
        const childSize = child.entity.get((0, _components.Layout)).layout(child.entity, constraints);
        const size = new (0, _components.Size)(Math.min(constraints.maxWidth, childSize.width + 2 * padding), Math.min(constraints.maxHeight, childSize.height + 2 * padding));
        child.entity.update((0, _components.Offset), (offset)=>{
            offset.x = padding;
            offset.y = padding;
        });
        self.set(constraints, size, offset1);
        return size;
    }
    const width = (()=>{
        const c = self.get((0, _components.Width));
        return c !== undefined ? c.value : constraints.maxWidth;
    })();
    const height = (()=>{
        const c = self.get((0, _components.Height));
        return c !== undefined ? c.value : constraints.maxHeight;
    })();
    const size = new (0, _components.Size)(width, height);
    self.set(constraints, size, offset1);
    return size;
};
const geometry = (self, parentOffset, layers, z)=>{
    const offset = parentOffset.add(self.get((0, _components.Offset)));
    const { width , height  } = self.get((0, _components.Size));
    const x0 = offset.x;
    const x1 = x0 + width;
    const y0 = offset.y;
    const y1 = y0 + height;
    const color = self.get((0, _components.Color));
    if (color) {
        const { r , g , b , a  } = color;
        self.set(new (0, _components.Vertices)([
            x0,
            y0,
            x0,
            y1,
            x1,
            y0,
            x1,
            y1, 
        ]), new (0, _components.TextureCoordinates)([
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0, 
        ]), new (0, _components.Colors)([
            r,
            g,
            b,
            a,
            r,
            g,
            b,
            a,
            r,
            g,
            b,
            a,
            r,
            g,
            b,
            a, 
        ]), new (0, _components.VertexIndices)([
            0,
            1,
            2,
            1,
            2,
            3, 
        ]));
        layers.push({
            z,
            texture: 0,
            entity: self
        });
    }
    const child = self.get((0, _components.Child));
    if (child) child.entity.get((0, _components.Geometry)).geometry(child.entity, offset, layers, z + 1);
    self.set(new (0, _components.WorldSpace)(x0, y0, width, height));
};
const container = (ecs, properties, child)=>{
    const entity = ecs.entity(new (0, _components.Layout)(layout), new (0, _components.Geometry)(geometry), new (0, _components.Padding)(properties.padding ?? 0), new (0, _components.Translate)(properties.x ?? 0, properties.y ?? 0));
    if (properties.width !== undefined) entity.set(new (0, _components.Width)(properties.width));
    if (properties.height !== undefined) entity.set(new (0, _components.Height)(properties.height));
    if (child !== undefined) entity.set(new (0, _components.Child)(child));
    if (properties.color !== undefined) entity.set(properties.color);
    if (properties.onDrag !== undefined) entity.set(new (0, _components.OnDrag)(properties.onDrag));
    if (properties.onClick !== undefined) entity.set(new (0, _components.OnClick)(properties.onClick));
    return entity;
};

},{"../components":"563zL","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"hsfX6":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "scene", ()=>scene);
var _components = require("../components");
var _connection = require("./connection");
const layout = (self, constraints)=>{
    for (const child of self.get((0, _components.Children)).entities)child.get((0, _components.Layout)).layout(child, constraints);
    const size = new (0, _components.Size)(constraints.maxWidth, constraints.maxHeight);
    self.set(constraints, size, new (0, _components.Offset)(0, 0));
    return size;
};
const geometry = (self, parentOffset, layers, z)=>{
    const { width , height  } = self.get((0, _components.Size));
    const offset = parentOffset.add(self.get((0, _components.Offset)));
    for (const child of self.get((0, _components.Children)).entities)child.get((0, _components.Geometry)).geometry(child, offset, layers, z);
    (0, _connection.geometry)(self.get((0, _components.Connections)).entities, layers);
    self.set(new (0, _components.WorldSpace)(offset.x, offset.y, width, height));
};
const scene = (ecs, properties)=>{
    properties = properties ?? {};
    return ecs.entity(new (0, _components.Layout)(layout), new (0, _components.Geometry)(geometry), new (0, _components.Children)(properties.children ?? []), new (0, _components.Connections)(properties.connections ?? []));
};

},{"../components":"563zL","./connection":"j3u17","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"j3u17":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "geometry", ()=>geometry);
parcelHelpers.export(exports, "connection", ()=>connection);
var _components = require("../components");
const linspace = (start, stop, num)=>{
    const step = (stop - start) / (num - 1);
    return Array.from({
        length: num
    }, (_, i)=>start + step * i);
};
const cubicBezier = (ts, from, to)=>{
    const p0x = from.x + from.width / 2;
    const p0y = from.y + from.height / 2;
    const p1x = p0x + 50;
    const p1y = p0y;
    const p3x = to.x + to.width / 2;
    const p3y = to.y + to.height / 2;
    const p2x = p3x - 50;
    const p2y = p3y;
    const result = [];
    let lastX = 0;
    let lastY = 0;
    for (const t of ts){
        const tSquared = t * t;
        const tCubed = tSquared * t;
        const oneMinusT = 1 - t;
        const oneMinusTSquared = oneMinusT * oneMinusT;
        const oneMinusTCubed = oneMinusTSquared * oneMinusT;
        const a = oneMinusTCubed;
        const b = 3 * oneMinusTSquared * t;
        const c = 3 * oneMinusT * tSquared;
        const d = tCubed;
        const x = a * p0x + b * p1x + c * p2x + d * p3x;
        const y = a * p0y + b * p1y + c * p2y + d * p3y;
        if (result.length) result.push(lastX, lastY);
        else result.push(x, y);
        result.push(x, y);
        lastX = x;
        lastY = y;
    }
    return result;
};
const geometry = (connections, layers)=>{
    const samples = 20;
    const ts = linspace(0, 1, samples);
    const textureCoordinates = Array(samples * 4).fill(0);
    for (const entity of connections){
        const from = entity.get((0, _components.From)).entity.get((0, _components.WorldSpace));
        const to = entity.get((0, _components.To)).entity.get((0, _components.WorldSpace));
        const vertices = cubicBezier(ts, from, to);
        const { r , g , b , a  } = entity.get((0, _components.Color));
        const colors = [];
        for(let i = 0; i < samples * 2; ++i)colors.push(r, g, b, a);
        entity.set(new (0, _components.Vertices)(vertices), new (0, _components.TextureCoordinates)(textureCoordinates), new (0, _components.Colors)(colors));
        layers.lines.push(entity);
    }
};
const connection = (ecs, properties)=>ecs.entity(new (0, _components.From)(properties.from), new (0, _components.To)(properties.to), properties.color ?? new (0, _components.Color)(255, 255, 255, 255));

},{"../components":"563zL","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"lfhKB":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "stack", ()=>stack);
var _components = require("../components");
const layout = (self, constraints)=>{
    const children = self.get((0, _components.Children)).entities;
    for (const child of children)child.get((0, _components.Layout)).layout(child, constraints);
    const size = new (0, _components.Size)(constraints.maxWidth, constraints.maxHeight);
    self.set(constraints, size, new (0, _components.Offset)(0, 0));
    return size;
};
const geometry = (self, parentOffset, layers, z)=>{
    const { width , height  } = self.get((0, _components.Size));
    const offset = parentOffset.add(self.get((0, _components.Offset)));
    for (const child of self.get((0, _components.Children)).entities){
        child.get((0, _components.Geometry)).geometry(child, offset, layers, z);
        z += 1;
    }
    self.set(new (0, _components.WorldSpace)(offset.x, offset.y, width, height));
};
const stack = (ecs, children)=>ecs.entity(new (0, _components.Layout)(layout), new (0, _components.Geometry)(geometry), new (0, _components.Children)(children));

},{"../components":"563zL","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"FNPLR":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "clickOutput", ()=>clickOutput);
var _components = require("../components");
var _ui = require("../ui");
var _render = require("./render");
const clickOutput = (graph)=>(entity)=>{
        const ecs = entity.ecs;
        const connectionTo = ecs.get((0, _components.ConnectionTo)).entity;
        const connectionFrom = ecs.get((0, _components.ConnectionFrom)).entity;
        if (!connectionTo) {
            if (connectionFrom === entity) return;
            else if (connectionFrom !== null) connectionFrom.set(new (0, _components.Color)(101, 215, 249, 255));
            ecs.update((0, _components.ConnectionFrom), (from)=>from.entity = entity);
            entity.set(new (0, _components.Color)(67, 76, 112, 255));
            requestAnimationFrame(()=>(0, _render.render)(ecs));
        } else {
            const con = (0, _ui.connection)(ecs, {
                from: entity,
                to: connectionTo
            });
            graph.update((0, _components.Connections), (connections)=>connections.entities.push(con));
            connectionTo.set(new (0, _components.Color)(101, 215, 249, 255));
            ecs.update((0, _components.ConnectionTo), (to)=>to.entity = null);
            requestAnimationFrame(()=>(0, _render.render)(ecs));
        }
    };

},{"../components":"563zL","../ui":"cOWCo","./render":"b41K2","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"6YoP9":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "drag", ()=>drag);
var _components = require("../components");
const drag = (entity, x, y)=>entity.update((0, _components.Translate), (translate)=>{
        translate.x += x;
        translate.y += y;
    });

},{"../components":"563zL","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"bCZLy":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Entity", ()=>Entity);
parcelHelpers.export(exports, "ECS", ()=>ECS);
class Storage {
    constructor(){
        this.clear();
    }
    get = (entity)=>{
        const index = this.lookup.get(entity.id);
        return index !== undefined ? this.data[index] : undefined;
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
    clear = ()=>{
        this.lookup = new Map();
        this.data = [];
        this.inverses = [];
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
        this.update = (Type, f)=>f(this.ecs.storages.get(Type).get(this));
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
    set = (...components)=>{
        for (const component of components){
            const Type = component.constructor;
            this.resources.set(Type, component);
        }
    };
    get = (Type)=>{
        return this.resources.get(Type);
    };
    update = (Type, f)=>f(this.resources.get(Type));
    unsetAll = (Type)=>{
        const storage = this.storages.get(Type);
        if (!storage) return;
        storage.clear();
    };
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["17ZdQ","h7u1C"], "h7u1C", "parcelRequire045c")

//# sourceMappingURL=index.b71e74eb.js.map
