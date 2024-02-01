function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
import React from 'react';
import mapboxgl from 'mapbox-gl';
import MapContext from '../MapContext';

/**
 * MapView backed by Mapbox GL KS
 */
class MapView extends React.Component {
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
    const map = new mapboxgl.Map({
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
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        height: '100%'
      },
      ref: el => this.mapContainer = el
    }, map && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute'
      }
    }, /*#__PURE__*/React.createElement(MapContext.Provider, {
      value: {
        map
      }
    }, children)));
  }
}
export default MapView;
//# sourceMappingURL=MapView.js.map