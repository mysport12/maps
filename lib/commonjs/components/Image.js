"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _RNMBXImageNativeComponent = _interopRequireDefault(require("../specs/RNMBXImageNativeComponent"));
var _NativeRNMBXImageModule = _interopRequireDefault(require("../specs/NativeRNMBXImageModule"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const Image = /*#__PURE__*/(0, _react.memo)( /*#__PURE__*/(0, _react.forwardRef)(function Image(_ref, ref) {
  let {
    name,
    sdf,
    stretchX,
    stretchY,
    children
  } = _ref;
  const nativeProps = {
    name,
    sdf,
    stretchX,
    stretchY,
    children
  };
  const imageRef = _react.default.useRef(null);
  const refresh = () => {
    const handle = (0, _reactNative.findNodeHandle)(imageRef.current);
    _NativeRNMBXImageModule.default.refresh(handle);
  };
  _react.default.useImperativeHandle(ref, () => {
    return {
      refresh
    };
  });

  // @ts-expect-error just codegen stuff
  return /*#__PURE__*/_react.default.createElement(_RNMBXImageNativeComponent.default, _extends({}, nativeProps, {
    ref: imageRef
  }));
}));
Image.displayName = 'Image';
var _default = Image;
exports.default = _default;
//# sourceMappingURL=Image.js.map