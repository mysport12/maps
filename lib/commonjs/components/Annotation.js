"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _Animated = _interopRequireDefault(require("../utils/animated/Animated"));
var _classes = require("../classes");
var _SymbolLayer = require("./SymbolLayer");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
class Annotation extends _react.default.Component {
  constructor(props) {
    super(props);
    const shape = this._getShapeFromProps(props);
    this.state = {
      shape: props.animated ? new _classes.AnimatedPoint(shape) : shape
    };
    this.onPress = this.onPress.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (!Array.isArray(this.props.coordinates)) {
      this.setState({
        shape: null
      });
      return;
    }
    const haveCoordinatesChanged = prevProps.coordinates[0] !== this.props.coordinates[0] || prevProps.coordinates[1] !== this.props.coordinates[1];
    if (prevProps.animated !== this.props.animated || haveCoordinatesChanged && (!this.state.shape || !this.props.animated)) {
      const shape = this._getShapeFromProps(this.props);
      this.setState({
        shape: this.props.animated ? new _classes.AnimatedPoint(shape) : shape
      });
    } else if (haveCoordinatesChanged && this.props.animated && this.state.shape) {
      // flush current animations
      this.state.shape.stopAnimation();
      this.state.shape.timing({
        coordinates: this.props.coordinates,
        easing: this.props.animationEasingFunction,
        duration: this.props.animationDuration
      }).start();
    }
  }
  onPress(event) {
    if (this.props.onPress) {
      this.props.onPress(event);
    }
  }
  _getShapeFromProps() {
    var _props$coordinates, _props$coordinates2;
    let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const lng = ((_props$coordinates = props.coordinates) === null || _props$coordinates === void 0 ? void 0 : _props$coordinates[0]) || 0;
    const lat = ((_props$coordinates2 = props.coordinates) === null || _props$coordinates2 === void 0 ? void 0 : _props$coordinates2[1]) || 0;
    return {
      type: 'Point',
      coordinates: [lng, lat]
    };
  }
  get symbolStyle() {
    if (!this.props.icon) {
      return undefined;
    }
    return Object.assign({}, this.props.style, {
      iconImage: this.props.icon
    });
  }
  render() {
    if (!this.props.coordinates) {
      return null;
    }
    const children = [];
    if (this.symbolStyle) {
      children.push( /*#__PURE__*/_react.default.createElement(_SymbolLayer.SymbolLayer, {
        id: `${this.props.id}-symbol`,
        style: this.symbolStyle
      }));
    }
    if (this.props.children) {
      if (Array.isArray(this.props.children)) {
        children.push(...this.props.children);
      } else {
        children.push(this.props.children);
      }
    }
    return /*#__PURE__*/_react.default.createElement(_Animated.default.ShapeSource, {
      id: this.props.id,
      onPress: this.onPress,
      shape: this.state.shape
    }, children);
  }
}
_defineProperty(Annotation, "defaultProps", {
  animated: false,
  animationDuration: 1000,
  animationEasingFunction: _reactNative.Easing.linear
});
var _default = Annotation;
exports.default = _default;
//# sourceMappingURL=Annotation.js.map