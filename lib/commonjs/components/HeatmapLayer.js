"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _RNMBXHeatmapLayerNativeComponent = _interopRequireDefault(require("../specs/RNMBXHeatmapLayerNativeComponent"));
var _AbstractLayer = _interopRequireDefault(require("./AbstractLayer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
const Mapbox = _reactNative.NativeModules.RNMBXModule;

// @{codepart-replace-start(LayerPropsCommon.codepart-tsx)}

/**
 * HeatmapLayer is a style layer that renders one or more filled circles on the map.
 */
class HeatmapLayer extends _AbstractLayer.default {
  render() {
    const props = {
      ...this.props,
      ...this.baseProps,
      sourceLayerID: this.props.sourceLayerID
    };
    return (
      /*#__PURE__*/
      // @ts-expect-error just codegen stuff
      _react.default.createElement(_RNMBXHeatmapLayerNativeComponent.default, _extends({
        ref: this.setNativeLayer
      }, props))
    );
  }
}
_defineProperty(HeatmapLayer, "defaultProps", {
  sourceID: Mapbox.StyleSource.DefaultSourceID
});
var _default = HeatmapLayer;
exports.default = _default;
//# sourceMappingURL=HeatmapLayer.js.map