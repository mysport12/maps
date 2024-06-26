"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _filterUtils = require("../utils/filterUtils");
var _StyleValue = require("../utils/StyleValue");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
class AbstractLayer extends _react.default.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "nativeLayer", null);
    _defineProperty(this, "setNativeLayer", instance => {
      this.nativeLayer = instance;
    });
  }
  get baseProps() {
    return {
      ...this.props,
      id: this.props.id,
      existing: this.props.existing,
      sourceID: this.props.sourceID,
      reactStyle: this.getStyle(this.props.style),
      minZoomLevel: this.props.minZoomLevel,
      maxZoomLevel: this.props.maxZoomLevel,
      aboveLayerID: this.props.aboveLayerID,
      belowLayerID: this.props.belowLayerID,
      layerIndex: this.props.layerIndex,
      filter: (0, _filterUtils.getFilter)(this.props.filter),
      style: undefined
    };
  }
  getStyleTypeFormatter(styleType) {
    if (styleType === 'color') {
      return _reactNative.processColor;
    }
    return undefined;
  }
  getStyle(style) {
    return (0, _StyleValue.transformStyle)(style);
  }
  setNativeProps(props) {
    if (this.nativeLayer) {
      var _this$nativeLayer;
      let propsToPass = props;
      if (props.style) {
        propsToPass = {
          ...props,
          reactStyle: this.getStyle(props.style)
        };
      }
      (_this$nativeLayer = this.nativeLayer) === null || _this$nativeLayer === void 0 ? void 0 : _this$nativeLayer.setNativeProps(propsToPass);
    }
  }
}
var _default = AbstractLayer;
exports.default = _default;
//# sourceMappingURL=AbstractLayer.js.map