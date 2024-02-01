import type { HostComponent, ViewProps } from 'react-native';
import { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
import type { UnsafeMixed } from './codegenUtils';
declare type OptionalProp<T> = UnsafeMixed<T>;
export declare type FollowPuckOptionsNative = {
    zoom?: number | 'keep';
    pitch?: number | 'keep';
    bearing?: 'course' | 'heading' | number | 'keep';
    padding?: {
        top?: number;
        left?: number;
        bottom?: number;
        right?: number;
    } | 'keep';
};
export declare type ViewportStateNative = {
    kind: 'followPuck';
    options?: FollowPuckOptionsNative;
} | {
    kind: 'overview';
};
declare type ViewportStatus = {
    kind: 'idle';
} | {
    kind: 'transition';
    toState: ViewportStateNative;
    transition: ViewportTransition;
};
declare type ViewportTransition = {
    kind: 'immediate';
} | {
    kind: 'default';
    maxDurationMs?: number;
};
declare type ViewportStatusChangeReason = 'TransitionStarted' | 'TransitionSucceeded' | 'IdleRequested' | 'UserInteraction';
export declare type OnStatusChangedEventPayload = {
    from: ViewportStatus;
    to: ViewportStatus;
    reason: ViewportStatusChangeReason;
};
declare type OnStatusChangedEventType = {
    type: string;
    payload: string;
};
export declare type OnStatusChangedEventTypeReal = {
    type: 'statuschanged';
    payload: UnsafeMixed<OnStatusChangedEventPayload>;
};
export interface NativeProps extends ViewProps {
    transitionsToIdleUponUserInteraction?: OptionalProp<boolean>;
    hasStatusChanged: boolean;
    onStatusChanged?: DirectEventHandler<OnStatusChangedEventType>;
}
declare const _default: HostComponent<NativeProps>;
export default _default;
export declare type NativeViewportReal = HostComponent<Omit<NativeProps, 'onStatusChanged'> & {
    onStatusChanged?: DirectEventHandler<OnStatusChangedEventTypeReal>;
}>;
//# sourceMappingURL=RNMBXViewportNativeComponent.d.ts.map