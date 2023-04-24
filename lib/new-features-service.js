(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["NewFeatureLibrary"] = factory();
	else
		root["NewFeatureLibrary"] = factory();
})(self, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "NewFeaturesService": function() { return /* binding */ NewFeaturesService; }
});

;// CONCATENATED MODULE: ./src/compatibility-service.ts
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class CompatibilityService {
  constructor(groups) {
    _defineProperty(this, "_groups", void 0);
    this._groups = groups;
  }
  compatible(feature, visibleFeatures) {
    if (!feature) return feature;
    for (let i = 0; i < this._groups.length; i++) {
      const gr = this._groups[i];
      if (!visibleFeatures || gr & visibleFeatures) {
        const compatibleFeatures = feature & gr;
        if (compatibleFeatures) return compatibleFeatures;
      }
    }
    return 0;
  }
}
;// CONCATENATED MODULE: ./src/new-features-service.ts
function new_features_service_defineProperty(obj, key, value) { key = new_features_service_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function new_features_service_toPropertyKey(arg) { var key = new_features_service_toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function new_features_service_toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

class NewFeaturesService {
  get shownNewFeatures() {
    return this._shownNewFeatures;
  }
  get _newFeatures$() {
    if (!this._promise$) this._promise$ = this._provider.getNewFeatures();
    return this._promise$;
  }
  constructor(_provider, compatibilityGroups) {
    this._provider = _provider;
    new_features_service_defineProperty(this, "_shownNewFeatures", 0);
    new_features_service_defineProperty(this, "_promise$", void 0);
    new_features_service_defineProperty(this, "_compatibilityService", void 0);
    new_features_service_defineProperty(this, "_subscriptions", []);
    new_features_service_defineProperty(this, "_pushSubscriptions", []);
    new_features_service_defineProperty(this, "refreshNewFeatures", () => {
      this._promise$ = this._provider.getNewFeatures();
      this._newFeatures$.then(() => {
        this._subscriptions.forEach(fn => fn());
      });
    });
    this._compatibilityService = new CompatibilityService(compatibilityGroups);
  }
  async availableFeatures(feature) {
    const curNewFeatures = (await this._newFeatures$) & feature;
    return curNewFeatures & this._compatibilityService.compatible(curNewFeatures, this._shownNewFeatures);
  }
  async showAvailableFeatures(feature) {
    const newFeatures = await this.availableFeatures(feature);
    if (newFeatures) this._shownNewFeatures |= newFeatures;
    return newFeatures;
  }
  async isNewFeature(feature) {
    const newFeatures = await this.availableFeatures(feature);
    return (newFeatures & feature) === feature;
  }
  async markNewFeatureAsUsed(feature) {
    const isNew = await this.isNewFeature(feature);
    if (isNew) this._provider.markNewFeatureAsUsed(feature);
    return isNew;
  }
  hide(feature) {
    this._shownNewFeatures &= ~feature;
  }
  subscribeOnChangeState(fn) {
    if (this._subscriptions.find(f => f === fn)) return;
    this._subscriptions.push(fn);
    if (this._subscriptions.length === 1) this.subscribeListener(this.refreshNewFeatures);
  }
  unsubscribeFromChangeState(fn) {
    const index = this._subscriptions.indexOf(fn);
    if (index === -1) return;
    this._subscriptions.splice(index, 1);
    if (!this._subscriptions.length) this.unsubscribeListener(this.refreshNewFeatures);
  }
  subscribeListener(fn) {
    if (this._pushSubscriptions.find(f => f === fn)) return;
    this._pushSubscriptions.push(fn);
    if (this._pushSubscriptions.length === 1) this._provider.startListenPushes(this.update.bind(this));
  }
  unsubscribeListener(fn) {
    const index = this._pushSubscriptions.indexOf(fn);
    if (index === -1) return;
    this._pushSubscriptions.splice(index, 1);
    if (!this._pushSubscriptions.length) this._provider.stopListenPushes();
  }
  update() {
    this._pushSubscriptions.forEach(fn => fn());
  }
}
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=new-features-service.js.map