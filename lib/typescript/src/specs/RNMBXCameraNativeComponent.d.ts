import type { HostComponent, ViewProps } from 'react-native';
import { DirectEventHandler, Double, Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import type { NativeCameraStop, UnsafeMixed } from './codegenUtils';
declare type OptionalProp<T> = UnsafeMixed<T>;
declare type UserTrackingModeChangeEventType = {
    type: string;
    payloadRenamed: {
        followUserLocation: boolean;
        followUserMode: string;
    };
};
export interface NativeProps extends ViewProps {
    maxBounds?: UnsafeMixed<string | null>;
    animationDuration?: OptionalProp<Double>;
    animationMode?: OptionalProp<string>;
    defaultStop?: UnsafeMixed<NativeCameraStop>;
    userTrackingMode?: OptionalProp<Int32>;
    followUserLocation?: OptionalProp<boolean>;
    followUserMode?: OptionalProp<string>;
    followZoomLevel?: OptionalProp<Double>;
    followPitch?: OptionalProp<Double>;
    followHeading?: OptionalProp<Double>;
    followPadding?: UnsafeMixed<any>;
    zoomLevel?: OptionalProp<Double>;
    maxZoomLevel?: OptionalProp<Double>;
    minZoomLevel?: OptionalProp<Double>;
    stop?: UnsafeMixed<NativeCameraStop>;
    onUserTrackingModeChange?: DirectEventHandler<UserTrackingModeChangeEventType>;
}
declare const _default: HostComponent<NativeProps>;
export default _default;
//# sourceMappingURL=RNMBXCameraNativeComponent.d.ts.map