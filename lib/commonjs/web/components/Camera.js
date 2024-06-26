"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Camera = void 0;
var _react = _interopRequireDefault(require("react"));
var _MapContext = _interopRequireDefault(require("../MapContext"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
class Camera extends _react.default.Component {
  componentDidMount() {
    const {
      map
    } = this.context;
    const {
      centerCoordinate
    } = this.props;
    if (map && centerCoordinate) {
      map.flyTo({
        center: centerCoordinate
      });
    }
  }
  fitBounds(northEastCoordinates, southWestCoordinates) {
    let padding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    let animationDuration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.0;
    const {
      map
    } = this.context;
    if (map) {
      map.fitBounds([northEastCoordinates, southWestCoordinates]);
    }
  }
  render() {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
  }
}
exports.Camera = Camera;
_defineProperty(Camera, "contextType", _MapContext.default);
_defineProperty(Camera, "UserTrackingModes", []);
var _default = Camera;
exports.default = _default;
//# sourceMappingURL=Camera.js.map