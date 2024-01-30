import type { HostComponent, ViewProps } from 'react-native';
import { DirectEventHandler, Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import type { Point, UnsafeMixed } from './codegenUtils';
declare type OptionalProp<T> = UnsafeMixed<T>;
declare type GestureSettings = {
    doubleTapToZoomInEnabled?: boolean;
    doubleTouchToZoomOutEnabled?: boolean;
    pinchScrollEnabled?: boolean;
    pinchToZoomDecelerationEnabled?: boolean;
};
declare type LocalizeLabels = {
    locale: string;
    layerIds?: string[];
} | true;
declare type OnCameraChangedEventType = {
    type: string;
    payload: string;
};
declare type OnPressEventType = {
    type: string;
    payload: string;
};
declare type OnMapChangeEventType = {
    type: string;
    payload: string;
};
export interface NativeProps extends ViewProps {
    attributionEnabled?: OptionalProp<boolean>;
    attributionPosition?: UnsafeMixed<any>;
    logoEnabled?: OptionalProp<boolean>;
    logoPosition?: UnsafeMixed<any>;
    compassEnabled?: OptionalProp<boolean>;
    compassFadeWhenNorth?: OptionalProp<boolean>;
    compassPosition?: UnsafeMixed<any>;
    compassViewPosition?: OptionalProp<Int32>;
    compassViewMargins?: OptionalProp<Point>;
    scaleBarEnabled?: OptionalProp<boolean>;
    scaleBarPosition?: UnsafeMixed<any>;
    zoomEnabled?: OptionalProp<boolean>;
    scrollEnabled?: OptionalProp<boolean>;
    rotateEnabled?: OptionalProp<boolean>;
    pitchEnabled?: OptionalProp<boolean>;
    deselectAnnotationOnTap?: OptionalProp<boolean>;
    requestDisallowInterceptTouchEvent?: OptionalProp<boolean>;
    projection?: OptionalProp<'mercator' | 'globe'>;
    localizeLabels?: UnsafeMixed<LocalizeLabels>;
    styleURL?: OptionalProp<string>;
    gestureSettings?: UnsafeMixed<GestureSettings>;
    surfaceView?: OptionalProp<boolean>;
    scaleBarViewMargins?: UnsafeMixed<any>;
    attributionViewMargins?: UnsafeMixed<any>;
    attributionViewPosition?: UnsafeMixed<any>;
    compassImage?: OptionalProp<string>;
    onPress?: DirectEventHandler<OnPressEventType>;
    onLongPress?: DirectEventHandler<OnPressEventType>;
    onMapChange?: DirectEventHandler<OnMapChangeEventType>;
    onCameraChanged?: DirectEventHandler<OnCameraChangedEventType>;
    mapViewImpl?: OptionalProp<string>;
}
declare const _default: HostComponent<NativeProps>;
export default _default;
declare type MapState = {
    properties: {
        center: GeoJSON.Position;
        bounds: {
            ne: GeoJSON.Position;
            sw: GeoJSON.Position;
        };
        zoom: number;
        heading: number;
        pitch: number;
    };
    gestures: {
        isGestureActive: boolean;
    };
    timestamp?: number;
};
declare type RegionPayload = {
    zoomLevel: number;
    heading: number;
    animated: boolean;
    isUserInteraction: boolean;
    visibleBounds: GeoJSON.Position[];
    pitch: number;
};
declare type OnPressEventTypeActual = {
    type: string;
    payload: GeoJSON.Feature | string;
};
declare type OnCameraChangedEventTypeActual = {
    type: string;
    payload: MapState | string;
};
declare type OnMapChangeEventTypeActual = {
    type: string;
    payload: GeoJSON.Feature<GeoJSON.Point, RegionPayload & {
        isAnimatingFromUserInteraction: boolean;
    }> | string;
};
export declare type NativeMapViewActual = HostComponent<Omit<NativeProps, 'onCameraChanged' | 'onLongPress' | 'onMapChange'> & {
    onCameraChanged?: DirectEventHandler<OnCameraChangedEventTypeActual>;
    onLongPress?: DirectEventHandler<OnPressEventTypeActual>;
    onPress?: DirectEventHandler<OnPressEventTypeActual>;
    onMapChange?: DirectEventHandler<OnMapChangeEventTypeActual>;
}>;
//# sourceMappingURL=RNMBXMapViewNativeComponent.d.ts.map