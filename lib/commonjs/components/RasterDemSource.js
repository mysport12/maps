"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _RNMBXRasterDemSourceNativeComponent = _interopRequireDefault(require("../specs/RNMBXRasterDemSourceNativeComponent"));
var _utils = require("../utils");
var _AbstractSource = _interopRequireDefault(require("./AbstractSource"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
const isTileTemplateUrl = url => !!url && (url.includes('{z}') || url.includes('{bbox-') || url.includes('{quadkey}'));
const MapboxGL = _reactNative.NativeModules.RNMBXModule;
class RasterDemSource extends _AbstractSource.default {
  constructor(props) {
    super(props);
    if (isTileTemplateUrl(props.url)) {
      console.warn(`RasterDemSource 'url' property contains a Tile URL Template, but is intended for a StyleJSON URL. Please migrate your VectorSource to use: \`tileUrlTemplates=["${props.url}"]\` instead.`);
    }
  }
  render() {
    let {
      url
    } = this.props;
    let {
      tileUrlTemplates
    } = this.props;

    // Swapping url for tileUrlTemplates to provide backward compatibility
    // when RasterSource supported only tile url as url prop
    if (isTileTemplateUrl(url)) {
      tileUrlTemplates = [url];
      url = undefined;
    }
    const props = {
      ...this.props,
      id: this.props.id,
      existing: this.props.existing,
      url,
      tileUrlTemplates,
      minZoomLevel: this.props.minZoomLevel,
      maxZoomLevel: this.props.maxZoomLevel,
      tileSize: this.props.tileSize
    };
    return (
      /*#__PURE__*/
      // @ts-expect-error just codegen stuff
      _react.default.createElement(_RNMBXRasterDemSourceNativeComponent.default, _extends({
        ref: this.setNativeRef
      }, props), (0, _utils.cloneReactChildrenWithProps)(this.props.children, {
        sourceID: this.props.id
      }))
    );
  }
}
_defineProperty(RasterDemSource, "defaultProps", {
  id: MapboxGL.StyleSource.DefaultSourceID
});
var _default = RasterDemSource;
exports.default = _default;
//# sourceMappingURL=RasterDemSource.js.map