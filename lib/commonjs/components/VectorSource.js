"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.NATIVE_MODULE_NAME = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _RNMBXVectorSourceNativeComponent = _interopRequireDefault(require("../specs/RNMBXVectorSourceNativeComponent"));
var _utils = require("../utils");
var _deprecation = require("../utils/deprecation");
var _AbstractSource = _interopRequireDefault(require("./AbstractSource"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
const MapboxGL = _reactNative.NativeModules.RNMBXModule;
const NATIVE_MODULE_NAME = 'RNMBXVectorSource';
exports.NATIVE_MODULE_NAME = NATIVE_MODULE_NAME;
// Omit<Props, 'children'>;
/**
 * VectorSource is a map content source that supplies tiled vector data in Mapbox Vector Tile format to be shown on the map.
 * The location of and metadata about the tiles are defined either by an option dictionary or by an external file that conforms to the TileJSON specification.
 */
class VectorSource extends _AbstractSource.default {
  constructor(props) {
    super(props);
  }
  _decodePayload(payload) {
    // we check whether the payload is a string, since the strict type safety is enforced only on iOS on the new arch
    // on Android, on both archs, the payload is an object
    if (typeof payload === 'string') {
      return JSON.parse(payload);
    } else {
      return payload;
    }
  }
  onPress(event) {
    const payload = this._decodePayload(event.nativeEvent.payload);
    const {
      features,
      coordinates,
      point
    } = payload;
    let newEvent = {
      features,
      coordinates,
      point
    };
    newEvent = (0, _deprecation.copyPropertiesAsDeprecated)(event, newEvent, key => {
      console.warn(`event.${key} is deprecated on VectorSource#onPress, please use event.features`);
    }, {
      nativeEvent: origNativeEvent => ({
        ...origNativeEvent,
        payload: features[0]
      })
    });
    const {
      onPress
    } = this.props;
    if (onPress) {
      onPress(newEvent);
    }
  }
  render() {
    const props = {
      id: this.props.id,
      existing: this.props.existing,
      url: this.props.url,
      tileUrlTemplates: this.props.tileUrlTemplates,
      minZoomLevel: this.props.minZoomLevel,
      maxZoomLevel: this.props.maxZoomLevel,
      tms: this.props.tms,
      attribution: this.props.attribution,
      hitbox: this.props.hitbox,
      hasPressListener: (0, _utils.isFunction)(this.props.onPress),
      onMapboxVectorSourcePress: this.onPress.bind(this),
      onPress: undefined
    };
    return (
      /*#__PURE__*/
      // @ts-expect-error just codegen stuff
      _react.default.createElement(_RNMBXVectorSourceNativeComponent.default, _extends({
        ref: this.setNativeRef
      }, props), (0, _utils.cloneReactChildrenWithProps)(this.props.children, {
        sourceID: this.props.id
      }))
    );
  }
}
_defineProperty(VectorSource, "defaultProps", {
  id: MapboxGL.StyleSource.DefaultSourceID
});
var _default = VectorSource;
exports.default = _default;
//# sourceMappingURL=VectorSource.js.map