import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { Int32 } from 'react-native/Libraries/Types/CodegenTypes';
declare type StateInfo = {
    kind: 'idle';
} | {
    kind: 'state';
    status: string;
} | {
    kind: 'transition';
    toState: string;
    transition: string;
};
declare type ObjectOr<T> = Object;
declare type StateReal = {
    kind: 'followPuck';
};
declare type State = ObjectOr<StateReal>;
declare type TransitionReal = {
    kind: 'immediate';
} | {
    kind: 'default';
    options: {
        maxDurationMs?: number;
    };
};
declare type Transition = ObjectOr<TransitionReal>;
declare type ViewRef = Int32 | null;
export interface Spec extends TurboModule {
    getState(viewRef: ViewRef): Promise<StateInfo>;
    transitionTo(viewRef: ViewRef, state: State, transition: Transition): Promise<void>;
    idle(viewRef: ViewRef): Promise<void>;
}
declare const _default: Spec;
export default _default;
//# sourceMappingURL=NativeRNMBXViewportModule.d.ts.map