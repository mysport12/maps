"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _RNMBXCalloutNativeComponent = _interopRequireDefault(require("../specs/RNMBXCalloutNativeComponent"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const styles = _reactNative.StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
    zIndex: 9999999
  },
  tip: {
    zIndex: 1000,
    marginTop: -2,
    elevation: 0,
    backgroundColor: 'transparent',
    borderTopWidth: 16,
    borderRightWidth: 8,
    borderBottomWidth: 0,
    borderLeftWidth: 8,
    borderTopColor: 'white',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent'
  },
  content: {
    position: 'relative',
    padding: 8,
    flex: 1,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    backgroundColor: 'white'
  },
  title: {
    color: 'black',
    textAlign: 'center'
  }
});
/**
 *  Callout that displays information about a selected annotation near the annotation.
 */
class Callout extends _react.default.PureComponent {
  get _containerStyle() {
    const style = [{
      position: 'absolute',
      zIndex: 999,
      backgroundColor: 'transparent'
    }];
    if (this.props.containerStyle) {
      style.push(this.props.containerStyle);
    }
    return style;
  }
  get _hasChildren() {
    return _react.default.Children.count(this.props.children) > 0;
  }
  _renderDefaultCallout() {
    return /*#__PURE__*/_react.default.createElement(_reactNative.Animated.View, {
      style: [styles.container, this.props.style]
    }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: [styles.content, this.props.contentStyle]
    }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: [styles.title, this.props.textStyle]
    }, this.props.title)), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: [styles.tip, this.props.tipStyle]
    }));
  }
  _renderCustomCallout() {
    return /*#__PURE__*/_react.default.createElement(_reactNative.Animated.View, _extends({}, this.props, {
      style: this.props.style
    }), this.props.children);
  }
  render() {
    const calloutContent = this._hasChildren ? this._renderCustomCallout() : this._renderDefaultCallout();
    return /*#__PURE__*/_react.default.createElement(_RNMBXCalloutNativeComponent.default, {
      style: this._containerStyle
    }, calloutContent);
  }
}
var _default = Callout;
exports.default = _default;
//# sourceMappingURL=Callout.js.map