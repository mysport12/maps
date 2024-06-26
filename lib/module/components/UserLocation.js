function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
import React from 'react';
import locationManager from '../modules/location/locationManager';
import Annotation from './Annotation';
import CircleLayer from './CircleLayer';
import HeadingIndicator from './HeadingIndicator';
import NativeUserLocation from './LocationPuck';
const mapboxBlue = 'rgba(51, 181, 229, 100)';
const layerStyles = {
  normal: {
    pulse: {
      circleRadius: 15,
      circleColor: mapboxBlue,
      circleOpacity: 0.2,
      circlePitchAlignment: 'map'
    },
    background: {
      circleRadius: 9,
      circleColor: '#fff',
      circlePitchAlignment: 'map'
    },
    foreground: {
      circleRadius: 6,
      circleColor: mapboxBlue,
      circlePitchAlignment: 'map'
    }
  }
};
const normalIcon = (showsUserHeadingIndicator, heading) => [/*#__PURE__*/React.createElement(CircleLayer, {
  key: "mapboxUserLocationPulseCircle",
  id: "mapboxUserLocationPulseCircle",
  style: layerStyles.normal.pulse
}), /*#__PURE__*/React.createElement(CircleLayer, {
  key: "mapboxUserLocationWhiteCircle",
  id: "mapboxUserLocationWhiteCircle",
  style: layerStyles.normal.background
}), /*#__PURE__*/React.createElement(CircleLayer, {
  key: "mapboxUserLocationBlueCircle",
  id: "mapboxUserLocationBlueCircle",
  aboveLayerID: "mapboxUserLocationWhiteCircle",
  style: layerStyles.normal.foreground
}), ...(showsUserHeadingIndicator && typeof heading === 'number' ? [HeadingIndicator({
  heading,
  key: 'mapboxUserLocationHeadingIndicator'
})] : [])];
export let UserLocationRenderMode;
(function (UserLocationRenderMode) {
  UserLocationRenderMode["Native"] = "native";
  UserLocationRenderMode["Normal"] = "normal";
})(UserLocationRenderMode || (UserLocationRenderMode = {}));
class UserLocation extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "_isMounted", undefined);
    _defineProperty(this, "locationManagerRunning", false);
    this.state = {
      shouldShowUserLocation: false,
      coordinates: null,
      heading: null
    };
    this._onLocationUpdate = this._onLocationUpdate.bind(this);
  }

  // required as #setLocationManager attempts to setState
  // after component unmount

  async componentDidMount() {
    this._isMounted = true;
    locationManager.setMinDisplacement(this.props.minDisplacement || 0);
    await this.setLocationManager({
      running: this.needsLocationManagerRunning()
    });
    if (this.props.renderMode === UserLocationRenderMode.Native) {
      return;
    }
  }
  async componentDidUpdate(prevProps) {
    await this.setLocationManager({
      running: this.needsLocationManagerRunning()
    });
    if (this.props.minDisplacement !== prevProps.minDisplacement) {
      locationManager.setMinDisplacement(this.props.minDisplacement || 0);
    }
    if (this.props.requestsAlwaysUse !== prevProps.requestsAlwaysUse) {
      locationManager.setRequestsAlwaysUse(this.props.requestsAlwaysUse || false);
    }
  }
  async componentWillUnmount() {
    this._isMounted = false;
    await this.setLocationManager({
      running: false
    });
  }

  /**
   * Whether to start or stop listening to the locationManager
   *
   * Notice, that listening will start automatically when
   * either `onUpdate` or `visible` are set
   *
   * @async
   * @param {Object} running - Object with key `running` and `boolean` value
   * @return {Promise<void>}
   */
  async setLocationManager(_ref) {
    let {
      running
    } = _ref;
    if (this.locationManagerRunning !== running) {
      this.locationManagerRunning = running;
      if (running) {
        locationManager.addListener(this._onLocationUpdate);
        const location = await locationManager.getLastKnownLocation();
        this._onLocationUpdate(location);
      } else {
        locationManager.removeListener(this._onLocationUpdate);
      }
    }
  }

  /**
   *
   * If locationManager should be running
   *
   * @return {boolean}
   */
  needsLocationManagerRunning() {
    return !!this.props.onUpdate || this.props.renderMode === UserLocationRenderMode.Normal && this.props.visible;
  }
  _onLocationUpdate(location) {
    if (!this._isMounted || !location) {
      return;
    }
    let coordinates = null;
    let heading = null;
    if (location && location.coords) {
      const {
        longitude,
        latitude
      } = location.coords;
      ({
        heading
      } = location.coords);
      coordinates = [longitude, latitude];
    }
    this.setState({
      coordinates,
      heading: heading ?? null
    });
    if (this.props.onUpdate) {
      this.props.onUpdate(location);
    }
  }
  _renderNative() {
    const {
      androidRenderMode,
      showsUserHeadingIndicator
    } = this.props;
    const props = {
      androidRenderMode,
      iosShowsUserHeadingIndicator: showsUserHeadingIndicator
    };
    return /*#__PURE__*/React.createElement(NativeUserLocation, props);
  }
  render() {
    const {
      heading,
      coordinates
    } = this.state;
    const {
      children,
      visible,
      showsUserHeadingIndicator,
      onPress,
      animated
    } = this.props;
    if (!visible) {
      return null;
    }
    if (this.props.renderMode === UserLocationRenderMode.Native) {
      return this._renderNative();
    }
    if (!coordinates) {
      return null;
    }
    return /*#__PURE__*/React.createElement(Annotation, {
      id: "mapboxUserLocation",
      animated: animated,
      onPress: onPress,
      coordinates: coordinates,
      style: {
        iconRotate: heading
      }
    }, children || normalIcon(showsUserHeadingIndicator, heading));
  }
}
_defineProperty(UserLocation, "defaultProps", {
  animated: true,
  visible: true,
  showsUserHeadingIndicator: false,
  requestsAlwaysUse: false,
  minDisplacement: 0,
  renderMode: UserLocationRenderMode.Normal
});
export default UserLocation;
//# sourceMappingURL=UserLocation.js.map