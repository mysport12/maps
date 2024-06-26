"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _RNMBXLightNativeComponent = _interopRequireDefault(require("../specs/RNMBXLightNativeComponent"));
var _StyleValue = require("../utils/StyleValue");
var _nativeRef = _interopRequireDefault(require("../utils/nativeRef"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/**
 * Light represents the light source for extruded geometries
 */
function Light(props, ref) {
  const {
    style,
    ...propWithoutStyle
  } = props;
  const nativeLightRef = (0, _nativeRef.default)((0, _react.useRef)(null));
  (0, _react.useImperativeHandle)(ref, () => ({
    setNativeProps(_props) {
      var _nativeLightRef$curre;
      let propsToPass = _props;
      if (_props.style) {
        propsToPass = {
          ..._props,
          reactStyle: (0, _StyleValue.transformStyle)(_props.style)
        };
      }
      (_nativeLightRef$curre = nativeLightRef.current) === null || _nativeLightRef$curre === void 0 ? void 0 : _nativeLightRef$curre.setNativeProps(propsToPass);
    }
  }));
  return /*#__PURE__*/_react.default.createElement(_RNMBXLightNativeComponent.default
  // @ts-expect-error just codegen stuff
  , _extends({
    ref: nativeLightRef,
    testID: "RNMBXLight"
  }, propWithoutStyle, {
    reactStyle: (0, _StyleValue.transformStyle)(style)
  }));
}
var _default = /*#__PURE__*/(0, _react.memo)( /*#__PURE__*/(0, _react.forwardRef)(Light));
exports.default = _default;
//# sourceMappingURL=Light.js.map