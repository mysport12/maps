"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SymbolLayer = exports.NATIVE_MODULE_NAME = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _RNMBXSymbolLayerNativeComponent = _interopRequireDefault(require("../specs/RNMBXSymbolLayerNativeComponent"));
var _AbstractLayer = _interopRequireDefault(require("./AbstractLayer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
const NATIVE_MODULE_NAME = 'RNMBXSymbolLayer';
exports.NATIVE_MODULE_NAME = NATIVE_MODULE_NAME;
const Mapbox = _reactNative.NativeModules.RNMBXModule;

// @{codepart-replace-start(LayerPropsCommon.codepart-tsx)}

/**
 * SymbolLayer is a style layer that renders icon and text labels at points or along lines on the map.
 */
class SymbolLayer extends _AbstractLayer.default {
  constructor() {
    super(...arguments);
    _defineProperty(this, "deprecationLogged", {
      snapshot: false
    });
  }
  _shouldSnapshot() {
    let isSnapshot = false;
    if (_react.default.Children.count(this.baseProps.children) <= 0) {
      return isSnapshot;
    }
    _react.default.Children.forEach(this.baseProps.children, child => {
      if ((child === null || child === void 0 ? void 0 : child.type) === _reactNative.View) {
        isSnapshot = true;
      }
    });
    if (isSnapshot && !this.deprecationLogged.snapshot) {
      console.warn('SymbolLayer: passing children for symbol layer is deprecated, please use @rnmapbox/maps Image component instead. https://github.com/rnmapbox/maps/wiki/Deprecated-SymbolLayerChildren');
      this.deprecationLogged.snapshot = true;
    }
    return isSnapshot;
  }
  render() {
    const props = {
      ...this.baseProps,
      snapshot: this._shouldSnapshot(),
      sourceLayerID: this.props.sourceLayerID
    };
    return (
      /*#__PURE__*/
      // @ts-expect-error just codegen stuff
      _react.default.createElement(_RNMBXSymbolLayerNativeComponent.default, _extends({
        ref: this.setNativeLayer
      }, props), this.props.children)
    );
  }
}
exports.SymbolLayer = SymbolLayer;
_defineProperty(SymbolLayer, "defaultProps", {
  sourceID: Mapbox.StyleSource.DefaultSourceID
});
//# sourceMappingURL=SymbolLayer.js.map