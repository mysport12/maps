import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { NativeModules } from 'react-native';

import { MapboxGLEvent } from '../types';
import { type Position } from '../types/Position';
import { makeLatLngBounds, makePoint } from '../utils/geoUtils';
import { type NativeRefType } from '../utils/nativeRef';
import NativeCameraView from '../specs/RNMBXCameraNativeComponent';

const NativeModule = NativeModules.RNMBXModule;

export enum UserTrackingMode {
  Follow = 'normal',
  FollowWithHeading = 'compass',
  FollowWithCourse = 'course',
}

export type UserTrackingModeChangeCallback = (
  event: MapboxGLEvent<
    'usertrackingmodechange',
    {
      followUserLocation: boolean;
      followUserMode: UserTrackingMode | null;
    }
  >,
) => void;

/**
 * Converts the provided React Native animation mode into the corresponding native enum value.
 */
const nativeAnimationMode = (
  mode?: CameraAnimationMode,
): NativeAnimationMode => {
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

type NativeAnimationMode = 'flight' | 'ease' | 'linear' | 'none' | 'move';

interface NativeCameraProps extends CameraFollowConfig {
  testID?: string;
  stop: NativeCameraStop | null;
  animationDuration?: number;
  animationMode?: CameraAnimationMode;
  defaultStop?: NativeCameraStop | null;
  minZoomLevel?: number;
  maxZoomLevel?: number;
  maxBounds?: string | null;
  onUserTrackingModeChange?: UserTrackingModeChangeCallback;
}

interface NativeCameraStop {
  centerCoordinate?: string;
  bounds?: string;
  heading?: number;
  pitch?: number;
  zoom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  duration?: number;
  mode?: NativeAnimationMode;
}

export interface CameraRef {
  setCamera: (
    config: CameraStop | CameraStops,
    ignoreFollowUserLocation: boolean,
  ) => void;
  fitBounds: (
    ne: Position,
    sw: Position,
    paddingConfig?: number | number[],
    animationDuration?: number,
  ) => void;
  flyTo: (centerCoordinate: Position, animationDuration?: number) => void;
  moveTo: (centerCoordinate: Position, animationDuration?: number) => void;
  zoomTo: (zoomLevel: number, animationDuration?: number) => void;
}

export type CameraStop = {
  /** Allows static check of the data type. For internal use only. */
  readonly type?: 'CameraStop';
  /** The location on which the map should center. */
  centerCoordinate?: Position;
  /** The corners of a box around which the map should bound. Contains padding props for backwards
   * compatibility; the root `padding` prop should be used instead. */
  bounds?: CameraBoundsWithPadding;
  /** The heading (orientation) of the map. */
  heading?: number;
  /** The pitch of the map. */
  pitch?: number;
  /** The zoom level of the map. */
  zoomLevel?: number;
  /** The viewport padding in points. */
  padding?: CameraPadding;
  /** The duration the map takes to animate to a new configuration. */
  animationDuration?: number;
  /** The easing or path the camera uses to animate to a new configuration. */
  animationMode?: CameraAnimationMode;
};

export type CameraFollowConfig = {
  /** Whether the map orientation follows the user location. */
  followUserLocation?: boolean;
  /** The mode used to track the user location on the map. */
  followUserMode?: UserTrackingMode;
  /** The zoom level used when following the user location. */
  followZoomLevel?: number;
  /** The pitch used when following the user location. */
  followPitch?: number;
  /** The heading used when following the user location. */
  followHeading?: number;
  /** The padding used to position the user location when following. */
  followPadding?: Partial<CameraPadding>;
};

export type CameraMinMaxConfig = {
  /** The lowest allowed zoom level. */
  minZoomLevel?: number;
  /** The highest allowed zoom level. */
  maxZoomLevel?: number;
  /** The corners of a box defining the limits of where the camera can pan or zoom. */
  maxBounds?: {
    ne: Position;
    sw: Position;
  };
};

export interface CameraProps
  extends CameraStop,
    CameraFollowConfig,
    CameraMinMaxConfig {
  /** The configuration that the camera falls back on, if no other values are specified. */
  defaultSettings?: CameraStop;

  /** Whether the camera should send any configuration to the native module. Prevents unnecessary tile
   * fetching and improves performance when the map is not visible. Defaults to `true`. */
  allowUpdates?: boolean;

  /** Any arbitrary primitive value that, when changed, causes the camera to retry moving to its target
   * configuration. (Not yet implemented.) */
  triggerKey?: string | number;

  /**
   * Executes when user tracking mode changes.
   * @deprecated use Viewport#onStatusChanged instead.
   */
  onUserTrackingModeChange?: UserTrackingModeChangeCallback;
}

export type CameraBounds = {
  ne: Position;
  sw: Position;
};

export type CameraPadding = {
  /** Left padding in points */
  paddingLeft: number;
  /** Right padding in points */
  paddingRight: number;
  /** Top padding in points */
  paddingTop: number;
  /** Bottom padding in points */
  paddingBottom: number;
};

export type CameraBoundsWithPadding = Partial<CameraPadding> & CameraBounds;

export type CameraStops = {
  /** Allows static check of the data type. For internal use only. */
  readonly type: 'CameraStops';
  stops: CameraStop[];
};

export type CameraAnimationMode =
  | 'flyTo'
  | 'easeTo'
  | 'linearTo'
  | 'moveTo'
  | 'none';

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
export const Camera = memo(
  forwardRef<CameraRef, CameraProps>(
    (props: CameraProps, ref: React.ForwardedRef<CameraRef>) => {
      const {
        allowUpdates = true,
        animationDuration,
        animationMode,
        bounds,
        centerCoordinate,
        defaultSettings,
        followHeading,
        followPadding,
        followPitch,
        followUserLocation,
        followUserMode,
        followZoomLevel,
        heading,
        maxBounds,
        maxZoomLevel,
        minZoomLevel,
        onUserTrackingModeChange,
        padding,
        pitch,
        zoomLevel,
      } = props;

      const nativeCamera = useRef<typeof NativeCameraView>(
        null,
      ) as NativeRefType<NativeCameraProps>;

      const buildNativeStop = useCallback(
        (
          stop: CameraStop,
          ignoreFollowUserLocation = false,
        ): NativeCameraStop | null => {
          stop = {
            ...stop,
            type: 'CameraStop',
          };

          if (followUserLocation && !ignoreFollowUserLocation) {
            return null;
          }

          const _nativeStop: NativeCameraStop = {};

          if (stop.pitch !== undefined) _nativeStop.pitch = stop.pitch;
          if (stop.heading !== undefined) _nativeStop.heading = stop.heading;
          if (stop.zoomLevel !== undefined) _nativeStop.zoom = stop.zoomLevel;
          if (stop.animationMode !== undefined)
            _nativeStop.mode = nativeAnimationMode(stop.animationMode);
          if (
            stop.animationDuration !== undefined ||
            animationDuration !== undefined
          )
            _nativeStop.duration = stop.animationDuration ?? animationDuration;

          if (stop.centerCoordinate) {
            _nativeStop.centerCoordinate = JSON.stringify(
              makePoint(stop.centerCoordinate),
            );
          }

          if (stop.bounds && stop.bounds.ne && stop.bounds.sw) {
            const { ne, sw } = stop.bounds;
            _nativeStop.bounds = JSON.stringify(makeLatLngBounds(ne, sw));
          }

          const paddingTop =
            stop.padding?.paddingTop ?? stop.bounds?.paddingTop;
          if (paddingTop !== undefined) {
            _nativeStop.paddingTop = paddingTop;
          }

          const paddingRight =
            stop.padding?.paddingRight ?? stop.bounds?.paddingRight;
          if (paddingRight !== undefined) {
            _nativeStop.paddingRight = paddingRight;
          }

          const paddingBottom =
            stop.padding?.paddingBottom ?? stop.bounds?.paddingBottom;
          if (paddingBottom != undefined) {
            _nativeStop.paddingBottom = paddingBottom;
          }

          const paddingLeft =
            stop.padding?.paddingLeft ?? stop.bounds?.paddingLeft;
          if (paddingLeft !== undefined) {
            _nativeStop.paddingLeft = paddingLeft;
          }

          return _nativeStop;
        },
        [animationDuration, followUserLocation],
      );

      // since codegen uses `payload` name in cpp code for creating payload for event,
      // we rename it to `payloadRenamed` to avoid name collision there on new arch
      const _onUserTrackingModeChange = useCallback(
        (
          event: MapboxGLEvent<
            'usertrackingmodechange',
            {
              followUserLocation: boolean;
              followUserMode: UserTrackingMode | null;
            }
          >,
        ) => {
          if (onUserTrackingModeChange) {
            if (!event.nativeEvent.payload) {
              // @ts-expect-error see the comment above
              event.nativeEvent.payload = event.nativeEvent.payloadRenamed;
            }
            onUserTrackingModeChange(event);
          }
        },
        [onUserTrackingModeChange],
      );

      const nativeDefaultStop = useMemo((): NativeCameraStop | null => {
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
          animationMode,
        });
      }, [
        centerCoordinate,
        bounds,
        heading,
        pitch,
        zoomLevel,
        padding,
        animationDuration,
        animationMode,
        buildNativeStop,
      ]);

      const nativeMaxBounds = useMemo(() => {
        if (!maxBounds?.ne || !maxBounds?.sw) {
          return null;
        }
        return JSON.stringify(makeLatLngBounds(maxBounds.ne, maxBounds.sw));
      }, [maxBounds]);

      // @ts-expect-error The compiler doesn't understand that the `config` union type is guaranteed
      // to be an object type.
      function setCamera(config, ignoreFollowUserLocation = false) {
        if (!allowUpdates) {
          return;
        }

        if (!config.type)
          config = {
            ...config,
            type: config.stops ? 'CameraStops' : 'CameraStop',
          };

        if (config.type === 'CameraStops') {
          for (const _stop of config.stops) {
            let _nativeStops: NativeCameraStop[] = [];
            const _nativeStop = buildNativeStop(
              _stop,
              ignoreFollowUserLocation,
            );
            if (_nativeStop) {
              _nativeStops = [..._nativeStops, _nativeStop];
            }
            nativeCamera.current?.setNativeProps({
              stop: { stops: _nativeStops },
            });
          }
        } else if (config.type === 'CameraStop') {
          const _nativeStop = buildNativeStop(config, ignoreFollowUserLocation);
          if (_nativeStop) {
            nativeCamera.current?.setNativeProps({ stop: _nativeStop });
          }
        }
      }

      function fitBounds(
        ne: Array<number>,
        sw: Array<number>,
        paddingConfig: Array<number> | number | undefined,
        _animationDuration = 0,
      ) {
        let _padding = {
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        };

        if (typeof paddingConfig === 'object') {
          if (paddingConfig.length === 2) {
            _padding = {
              paddingTop: paddingConfig[0],
              paddingBottom: paddingConfig[0],
              paddingLeft: paddingConfig[1],
              paddingRight: paddingConfig[1],
            };
          } else if (paddingConfig.length === 4) {
            _padding = {
              paddingTop: paddingConfig[0],
              paddingBottom: paddingConfig[2],
              paddingLeft: paddingConfig[3],
              paddingRight: paddingConfig[1],
            };
          }
        } else if (typeof paddingConfig === 'number') {
          _padding = {
            paddingTop: paddingConfig,
            paddingBottom: paddingConfig,
            paddingLeft: paddingConfig,
            paddingRight: paddingConfig,
          };
        }

        setCamera({
          type: 'CameraStop',
          bounds: { ne, sw },
          padding: _padding,
          animationDuration: _animationDuration,
          animationMode: 'easeTo',
        });
      }

      function flyTo(
        _centerCoordinate: Array<number>,
        _animationDuration = 2000,
      ) {
        setCamera({
          type: 'CameraStop',
          centerCoordinate: _centerCoordinate,
          animationDuration: _animationDuration,
        });
      }

      function moveTo(
        _centerCoordinate: Array<number>,
        _animationDuration = 0,
      ) {
        setCamera({
          type: 'CameraStop',
          centerCoordinate: _centerCoordinate,
          animationDuration: _animationDuration,
          animationMode: 'easeTo',
        });
      }

      function zoomTo(_zoomLevel: number, _animationDuration = 2000) {
        setCamera({
          type: 'CameraStop',
          zoomLevel: _zoomLevel,
          animationDuration: _animationDuration,
          animationMode: 'flyTo',
        });
      }

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
        zoomTo,
      }));

      return (
        <RNMBXCamera
          testID={'Camera'}
          // @ts-expect-error just codegen stuff
          ref={nativeCamera}
          stop={nativeStop}
          animationDuration={animationDuration}
          animationMode={animationMode}
          defaultStop={nativeDefaultStop}
          followUserLocation={followUserLocation}
          followUserMode={followUserMode}
          followZoomLevel={followZoomLevel}
          followPitch={followPitch}
          followHeading={followHeading}
          followPadding={followPadding}
          minZoomLevel={minZoomLevel}
          maxZoomLevel={maxZoomLevel}
          maxBounds={nativeMaxBounds}
          // @ts-expect-error just codegen stuff
          onUserTrackingModeChange={_onUserTrackingModeChange}
        />
      );
    },
  ),
);

const RNMBXCamera = NativeCameraView;

export type Camera = CameraRef;
