"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Terrain = void 0;
var _react = _interopRequireWildcard(require("react"));
var _StyleValue = require("../utils/StyleValue");
var _RNMBXTerrainNativeComponent = _interopRequireDefault(require("../specs/RNMBXTerrainNativeComponent"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const Terrain = /*#__PURE__*/(0, _react.memo)(props => {
  let {
    style = {}
  } = props;
  if (props.exaggeration) {
    console.warn(`Terrain: exaggeration property is deprecated pls use style.exaggeration instead!`);
    style = {
      exaggeration: props.exaggeration,
      ...style
    };
  }
  const baseProps = (0, _react.useMemo)(() => {
    return {
      ...props,
      reactStyle: (0, _StyleValue.transformStyle)(style),
      style: undefined
    };
  }, [props, style]);
  return /*#__PURE__*/_react.default.createElement(_RNMBXTerrainNativeComponent.default, baseProps);
});
exports.Terrain = Terrain;
//# sourceMappingURL=Terrain.js.map