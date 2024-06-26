"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _RNMBXMarkerViewContentNativeComponent = _interopRequireDefault(require("../specs/RNMBXMarkerViewContentNativeComponent"));
var _RNMBXMarkerViewNativeComponent = _interopRequireDefault(require("../specs/RNMBXMarkerViewNativeComponent"));
var _utils = require("../utils");
var _geoUtils = require("../utils/geoUtils");
var _PointAnnotation = _interopRequireDefault(require("./PointAnnotation"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
const Mapbox = _reactNative.NativeModules.RNMBXModule;
/**
 * MarkerView represents an interactive React Native marker on the map.
 *
 * If you have static views, consider using PointAnnotation or SymbolLayer to display
 * an image, as they'll offer much better performance. Mapbox suggests using this
 * component for a maximum of around 100 views displayed at one time.
 *
 * This is implemented with view annotations on [Android](https://docs.mapbox.com/android/maps/guides/annotations/view-annotations/)
 * and [iOS](https://docs.mapbox.com/ios/maps/guides/annotations/view-annotations).
 *
 * This component has no dedicated `onPress` method. Instead, you should handle gestures
 * with the React views passed in as `children`.
 */
class MarkerView extends _react.default.PureComponent {
  _idForPointAnnotation() {
    if (this.__idForPointAnnotation === undefined) {
      MarkerView.lastId = MarkerView.lastId + 1;
      this.__idForPointAnnotation = `MV-${MarkerView.lastId}`;
    }
    return this.__idForPointAnnotation;
  }
  _getCoordinate(coordinate) {
    if (!coordinate) {
      return undefined;
    }
    return (0, _utils.toJSONString)((0, _geoUtils.makePoint)(coordinate));
  }
  render() {
    if (this.props.anchor.x < 0 || this.props.anchor.y < 0 || this.props.anchor.x > 1 || this.props.anchor.y > 1) {
      console.warn(`[MarkerView] Anchor with value (${this.props.anchor.x}, ${this.props.anchor.y}) should not be outside the range [(0, 0), (1, 1)]`);
    }
    if (_reactNative.Platform.OS === 'ios' && !Mapbox.MapboxV10) {
      return /*#__PURE__*/_react.default.createElement(_PointAnnotation.default, _extends({
        id: this._idForPointAnnotation()
      }, this.props));
    }
    const {
      anchor = {
        x: 0.5,
        y: 0.5
      }
    } = this.props;
    return /*#__PURE__*/_react.default.createElement(RNMBXMarkerView, {
      style: [{
        flex: 0,
        alignSelf: 'flex-start'
      }, this.props.style],
      coordinate: [Number(this.props.coordinate[0]), Number(this.props.coordinate[1])],
      anchor: anchor,
      allowOverlap: this.props.allowOverlap,
      allowOverlapWithPuck: this.props.allowOverlapWithPuck,
      isSelected: this.props.isSelected,
      onTouchEnd: e => {
        e.stopPropagation();
      }
    }, /*#__PURE__*/_react.default.createElement(_RNMBXMarkerViewContentNativeComponent.default, {
      style: {
        flex: 0,
        alignSelf: 'flex-start'
      },
      onStartShouldSetResponder: _event => {
        return true;
      },
      onTouchEnd: e => {
        e.stopPropagation();
      }
    }, this.props.children));
  }
}
_defineProperty(MarkerView, "defaultProps", {
  anchor: {
    x: 0.5,
    y: 0.5
  },
  allowOverlap: false,
  allowOverlapWithPuck: false,
  isSelected: false
});
_defineProperty(MarkerView, "lastId", 0);
const RNMBXMarkerView = _RNMBXMarkerViewNativeComponent.default;
var _default = MarkerView;
exports.default = _default;
//# sourceMappingURL=MarkerView.js.map