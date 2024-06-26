"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _mapboxGl = _interopRequireDefault(require("mapbox-gl"));
var _MapContext = _interopRequireDefault(require("../MapContext"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
/**
 * MapView backed by Mapbox GL KS
 */
class MapView extends _react.default.Component {
  constructor() {
    super(...arguments);
    _defineProperty(this, "state", {
      map: null
    });
    _defineProperty(this, "mapContainer", null);
    _defineProperty(this, "map", null);
  }
  componentDidMount() {
    const {
      styleURL
    } = this.props;
    if (!this.mapContainer) {
      console.error('MapView - mapContainer should is null');
      return;
    }
    const map = new _mapboxGl.default.Map({
      container: this.mapContainer,
      style: styleURL || 'mapbox://styles/mapbox/streets-v11'
    });
    this.map = map;
    this.setState({
      map
    });
  }
  render() {
    const {
      children
    } = this.props;
    const {
      map
    } = this.state;
    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        width: '100%',
        height: '100%'
      },
      ref: el => this.mapContainer = el
    }, map && /*#__PURE__*/_react.default.createElement("div", {
      style: {
        position: 'absolute'
      }
    }, /*#__PURE__*/_react.default.createElement(_MapContext.default.Provider, {
      value: {
        map
      }
    }, children)));
  }
}
var _default = MapView;
exports.default = _default;
//# sourceMappingURL=MapView.js.map