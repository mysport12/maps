import React, { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { NativeModules } from 'react-native';
import { makeLatLngBounds, makePoint } from '../utils/geoUtils';
import NativeCameraView from '../specs/RNMBXCameraNativeComponent';
const NativeModule = NativeModules.RNMBXModule;
export let UserTrackingMode;
(function (UserTrackingMode) {
  UserTrackingMode["Follow"] = "normal";
  UserTrackingMode["FollowWithHeading"] = "compass";
  UserTrackingMode["FollowWithCourse"] = "course";
})(UserTrackingMode || (UserTrackingMode = {}));
/**
 * Converts the provided React Native animation mode into the corresponding native enum value.
 */
const nativeAnimationMode = mode => {
  const NativeCameraModes = NativeModule.CameraModes;
  switch (mode) {
    case 'flyTo':
      return NativeCameraModes.Flight;
    case 'easeTo':
      return NativeCameraModes.Ease;
    case 'linearTo':
      return NativeCameraModes.Linear;
    case 'moveTo':
      return NativeCameraModes.Move;
    case 'none':
      return NativeCameraModes.None;
    default:
      return NativeCameraModes.Ease;
  }
};

// Native module types.

/**
 * Controls the perspective from which the user sees the map.
 *
 * To use imperative methods, pass in a ref object:
 *
 * ```tsx
 * const camera = useRef<Camera>(null);
 *
 * useEffect(() => {
 *   camera.current?.setCamera({
 *     centerCoordinate: [lon, lat],
 *   });
 * }, []);
 *
 * return (
 *   <Camera ref={camera} />
 * );
 * ```
 */
export const Camera = /*#__PURE__*/memo( /*#__PURE__*/forwardRef((props, ref) => {
  const {
    centerCoordinate,
    bounds,
    heading,
    pitch,
    zoomLevel,
    padding,
    animationDuration,
    animationMode,
    minZoomLevel,
    maxZoomLevel,
    maxBounds,
    followUserLocation,
    followUserMode,
    followZoomLevel,
    followPitch,
    followHeading,
    followPadding,
    defaultSettings,
    allowUpdates = true,
    onUserTrackingModeChange
  } = props;
  const nativeCamera = useRef(null);
  const buildNativeStop = useCallback(function (stop) {
    var _stop$padding, _stop$bounds, _stop$padding2, _stop$bounds2, _stop$padding3, _stop$bounds3, _stop$padding4, _stop$bounds4;
    let ignoreFollowUserLocation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    stop = {
      ...stop,
      type: 'CameraStop'
    };
    if (followUserLocation && !ignoreFollowUserLocation) {
      return null;
    }
    const _nativeStop = {};
    if (stop.pitch !== undefined) _nativeStop.pitch = stop.pitch;
    if (stop.heading !== undefined) _nativeStop.heading = stop.heading;
    if (stop.zoomLevel !== undefined) _nativeStop.zoom = stop.zoomLevel;
    if (stop.animationMode !== undefined) _nativeStop.mode = nativeAnimationMode(stop.animationMode);
    if (stop.animationDuration !== undefined || animationDuration !== undefined) _nativeStop.duration = stop.animationDuration ?? animationDuration;
    if (stop.centerCoordinate) {
      _nativeStop.centerCoordinate = JSON.stringify(makePoint(stop.centerCoordinate));
    }
    if (stop.bounds && stop.bounds.ne && stop.bounds.sw) {
      const {
        ne,
        sw
      } = stop.bounds;
      _nativeStop.bounds = JSON.stringify(makeLatLngBounds(ne, sw));
    }
    const paddingTop = ((_stop$padding = stop.padding) === null || _stop$padding === void 0 ? void 0 : _stop$padding.paddingTop) ?? ((_stop$bounds = stop.bounds) === null || _stop$bounds === void 0 ? void 0 : _stop$bounds.paddingTop);
    if (paddingTop !== undefined) {
      _nativeStop.paddingTop = paddingTop;
    }
    const paddingRight = ((_stop$padding2 = stop.padding) === null || _stop$padding2 === void 0 ? void 0 : _stop$padding2.paddingRight) ?? ((_stop$bounds2 = stop.bounds) === null || _stop$bounds2 === void 0 ? void 0 : _stop$bounds2.paddingRight);
    if (paddingRight !== undefined) {
      _nativeStop.paddingRight = paddingRight;
    }
    const paddingBottom = ((_stop$padding3 = stop.padding) === null || _stop$padding3 === void 0 ? void 0 : _stop$padding3.paddingBottom) ?? ((_stop$bounds3 = stop.bounds) === null || _stop$bounds3 === void 0 ? void 0 : _stop$bounds3.paddingBottom);
    if (paddingBottom != undefined) {
      _nativeStop.paddingBottom = paddingBottom;
    }
    const paddingLeft = ((_stop$padding4 = stop.padding) === null || _stop$padding4 === void 0 ? void 0 : _stop$padding4.paddingLeft) ?? ((_stop$bounds4 = stop.bounds) === null || _stop$bounds4 === void 0 ? void 0 : _stop$bounds4.paddingLeft);
    if (paddingLeft !== undefined) {
      _nativeStop.paddingLeft = paddingLeft;
    }
    return _nativeStop;
  }, [animationDuration, followUserLocation]);

  // since codegen uses `payload` name in cpp code for creating payload for event,
  // we rename it to `payloadRenamed` to avoid name collision there on new arch
  const _onUserTrackingModeChange = useCallback(event => {
    if (onUserTrackingModeChange) {
      if (!event.nativeEvent.payload) {
        // @ts-expect-error see the comment above
        event.nativeEvent.payload = event.nativeEvent.payloadRenamed;
      }
      onUserTrackingModeChange(event);
    }
  }, [onUserTrackingModeChange]);
  const nativeDefaultStop = useMemo(() => {
    if (!defaultSettings) {
      return null;
    }
    return buildNativeStop(defaultSettings);
  }, [defaultSettings, buildNativeStop]);
  const nativeStop = useMemo(() => {
    return buildNativeStop({
      type: 'CameraStop',
      centerCoordinate,
      bounds,
      heading,
      pitch,
      zoomLevel,
      padding,
      animationDuration,
      animationMode
    });
  }, [centerCoordinate, bounds, heading, pitch, zoomLevel, padding, animationDuration, animationMode, buildNativeStop]);
  const nativeMaxBounds = useMemo(() => {
    if (!(maxBounds !== null && maxBounds !== void 0 && maxBounds.ne) || !(maxBounds !== null && maxBounds !== void 0 && maxBounds.sw)) {
      return null;
    }
    return JSON.stringify(makeLatLngBounds(maxBounds.ne, maxBounds.sw));
  }, [maxBounds]);
  const setCamera = function (config) {
    let ignoreFollowUserLocation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (!allowUpdates) {
      return;
    }
    lastTS += 1;
    if (!config.type)
      // @ts-expect-error The compiler doesn't understand that the `config` union type is guaranteed
      // to be an object type.
      config = {
        ...config,
        // @ts-expect-error Allows JS files to pass in an invalid config (lacking the `type` property),
        // which would raise a compilation error in TS files.
        type: config.stops ? 'CameraStops' : 'CameraStop'
      };
    if (config.type === 'CameraStops') {
      for (const _stop of config.stops) {
        var _nativeCamera$current;
        let _nativeStops = [];
        const _nativeStop = buildNativeStop(_stop, ignoreFollowUserLocation);
        if (_nativeStop) {
          _nativeStops = [..._nativeStops, _nativeStop];
        }
        (_nativeCamera$current = nativeCamera.current) === null || _nativeCamera$current === void 0 ? void 0 : _nativeCamera$current.setNativeProps({
          stop: {
            stops: _nativeStops,
            __updateTS: lastTS
          }
        });
      }
    } else if (config.type === 'CameraStop') {
      const _nativeStop = buildNativeStop(config, ignoreFollowUserLocation);
      if (_nativeStop) {
        var _nativeCamera$current2;
        (_nativeCamera$current2 = nativeCamera.current) === null || _nativeCamera$current2 === void 0 ? void 0 : _nativeCamera$current2.setNativeProps({
          stop: {
            __updateTS: lastTS,
            ..._nativeStop
          }
        });
      }
    }
  };
  const fitBounds = function (ne, sw, paddingConfig) {
    let _animationDuration = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    let _padding = {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0
    };
    if (typeof paddingConfig === 'object') {
      if (paddingConfig.length === 2) {
        _padding = {
          paddingTop: paddingConfig[0],
          paddingBottom: paddingConfig[0],
          paddingLeft: paddingConfig[1],
          paddingRight: paddingConfig[1]
        };
      } else if (paddingConfig.length === 4) {
        _padding = {
          paddingTop: paddingConfig[0],
          paddingBottom: paddingConfig[2],
          paddingLeft: paddingConfig[3],
          paddingRight: paddingConfig[1]
        };
      }
    } else if (typeof paddingConfig === 'number') {
      _padding = {
        paddingTop: paddingConfig,
        paddingBottom: paddingConfig,
        paddingLeft: paddingConfig,
        paddingRight: paddingConfig
      };
    }
    setCamera({
      type: 'CameraStop',
      bounds: {
        ne,
        sw
      },
      padding: _padding,
      animationDuration: _animationDuration,
      animationMode: 'easeTo'
    });
  };
  const flyTo = function (_centerCoordinate) {
    let _animationDuration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2000;
    setCamera({
      type: 'CameraStop',
      centerCoordinate: _centerCoordinate,
      animationDuration: _animationDuration
    });
  };
  const moveTo = function (_centerCoordinate) {
    let _animationDuration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    setCamera({
      type: 'CameraStop',
      centerCoordinate: _centerCoordinate,
      animationDuration: _animationDuration,
      animationMode: 'easeTo'
    });
  };
  const zoomTo = function (_zoomLevel) {
    let _animationDuration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2000;
    setCamera({
      type: 'CameraStop',
      zoomLevel: _zoomLevel,
      animationDuration: _animationDuration,
      animationMode: 'flyTo'
    });
  };
  useImperativeHandle(ref, () => ({
    /**
     * Sets any camera properties, with default fallbacks if unspecified.
     *
     * @example
     * camera.current?.setCamera({
     *   centerCoordinate: [lon, lat],
     * });
     *
     * @param {CameraStop | CameraStops} config
     * @param {boolean} ignoreFollowUserLocation
     */
    setCamera,
    /**
     * Set the camera position to enclose the provided bounds, with optional
     * padding and duration.
     *
     * @example
     * camera.fitBounds([lon, lat], [lon, lat]);
     * camera.fitBounds([lon, lat], [lon, lat], [20, 0], 1000);
     *
     * @param {Position} ne Northeast coordinate of bounding box
     * @param {Position} sw Southwest coordinate of bounding box
     * @param {number | number[]} paddingConfig The viewport padding, specified as a number (all sides equal), a 2-item array ([vertical, horizontal]), or a 4-item array ([top, right, bottom, left])
     * @param {number} animationDuration The transition duration
     */
    fitBounds,
    /**
     * Sets the camera to center around the provided coordinate using a realistic 'travel'
     * animation, with optional duration.
     *
     * @example
     * camera.flyTo([lon, lat]);
     * camera.flyTo([lon, lat], 12000);
     *
     *  @param {Position} centerCoordinate The coordinate to center in the view
     *  @param {number} animationDuration The transition duration
     */
    flyTo,
    /**
     * Sets the camera to center around the provided coordinate, with optional duration.
     *
     * @example
     * camera.moveTo([lon, lat], 200);
     * camera.moveTo([lon, lat]);
     *
     *  @param {Position} centerCoordinate The coordinate to center in the view
     *  @param {number} animationDuration The transition duration
     */
    moveTo,
    /**
     * Zooms the camera to the provided level, with optional duration.
     *
     * @example
     * camera.zoomTo(16);
     * camera.zoomTo(16, 100);
     *
     * @param {number} zoomLevel The target zoom
     * @param {number} animationDuration The transition duration
     */
    zoomTo
  }));
  return /*#__PURE__*/React.createElement(RNMBXCamera, {
    testID: 'Camera'
    // @ts-expect-error just codegen stuff
    ,
    ref: nativeCamera,
    stop: nativeStop,
    animationDuration: animationDuration,
    animationMode: animationMode,
    defaultStop: nativeDefaultStop,
    followUserLocation: followUserLocation,
    followUserMode: followUserMode,
    followZoomLevel: followZoomLevel,
    followPitch: followPitch,
    followHeading: followHeading,
    followPadding: followPadding,
    minZoomLevel: minZoomLevel,
    maxZoomLevel: maxZoomLevel,
    maxBounds: nativeMaxBounds
    // @ts-expect-error just codegen stuff
    ,
    onUserTrackingModeChange: _onUserTrackingModeChange
  });
}));
let lastTS = 0;
const RNMBXCamera = NativeCameraView;
//# sourceMappingURL=Camera.js.map