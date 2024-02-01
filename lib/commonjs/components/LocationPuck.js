"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _RNMBXNativeUserLocationNativeComponent = _interopRequireDefault(require("../specs/RNMBXNativeUserLocationNativeComponent"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const defaultProps = {
  visible: true
};

/**
 * Renders a puck on the map that shows the device's current location.
 */
const LocationPuck = /*#__PURE__*/(0, _react.memo)(props => {
  const {
    iosShowsUserHeadingIndicator,
    pulsing,
    ...rest
  } = props;
  const nativePulsing = pulsing ? _pulsingToNative(pulsing) : undefined;
  let baseProps = {
    ...defaultProps,
    pulsing: nativePulsing
  };
  if (iosShowsUserHeadingIndicator) {
    console.warn('LocationPuck: iosShowsUserHeadingIndicator is deprecated, use puckBearingEnabled={true} puckBearing="heading" instead');
    baseProps = {
      ...baseProps,
      puckBearingEnabled: true,
      puckBearing: 'heading'
    };
  }
  const actualProps = {
    ...baseProps,
    ...rest
  };
  return /*#__PURE__*/_react.default.createElement(_RNMBXNativeUserLocationNativeComponent.default, actualProps);
});
function _pulsingToNative(pulsing) {
  if (pulsing === 'default') {
    return {
      kind: 'default'
    };
  }
  if (pulsing == null) {
    return undefined;
  }
  const {
    color,
    isEnabled,
    radius
  } = pulsing;
  return {
    color: (0, _reactNative.processColor)(color),
    isEnabled,
    radius
  };
}
var _default = LocationPuck;
exports.default = _default;
//# sourceMappingURL=LocationPuck.js.map