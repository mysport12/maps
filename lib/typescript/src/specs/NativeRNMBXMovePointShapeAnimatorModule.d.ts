import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { Int32, Double } from 'react-native/Libraries/Types/CodegenTypes';
declare type AnimatorTag = Int32;
export interface Spec extends TurboModule {
    create(tag: AnimatorTag, from: ReadonlyArray<Double>): Promise<void>;
    start(tag: AnimatorTag): Promise<void>;
}
declare const _default: Spec;
export default _default;
//# sourceMappingURL=NativeRNMBXMovePointShapeAnimatorModule.d.ts.map