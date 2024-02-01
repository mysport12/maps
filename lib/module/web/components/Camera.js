function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
import React from 'react';
import MapContext from '../MapContext';
class Camera extends React.Component {
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
    return /*#__PURE__*/React.createElement(React.Fragment, null);
  }
}
_defineProperty(Camera, "contextType", MapContext);
_defineProperty(Camera, "UserTrackingModes", []);
export { Camera };
export default Camera;
//# sourceMappingURL=Camera.js.map