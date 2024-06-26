import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { Int32 } from 'react-native/Libraries/Types/CodegenTypes';
export interface Spec extends TurboModule {
    getClusterExpansionZoom: (viewRef: Int32 | null, featureJSON: string) => Promise<Object>;
    getClusterLeaves: (viewRef: Int32 | null, featureJSON: string, number: Int32, offset: Int32) => Promise<Object>;
    getClusterChildren: (viewRef: Int32 | null, featureJSON: string) => Promise<Object>;
}
declare const _default: Spec;
export default _default;
//# sourceMappingURL=NativeRNMBXShapeSourceModule.d.ts.map