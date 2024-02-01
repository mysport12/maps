import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { Int32 } from 'react-native/Libraries/Types/CodegenTypes';
declare type ObjectOr<T> = Object;
declare type StringOr<_T> = string;
declare type Domain = 'Maps' | 'Navigation' | 'Search' | 'ADAS';
declare type Tag = Int32;
declare type Value = {
    value: string | number;
};
export interface Spec extends TurboModule {
    shared(path?: string): Promise<Tag>;
    setOption(tag: Tag, key: string, domain: StringOr<Domain>, value: ObjectOr<Value>): Promise<void>;
}
declare const _default: Spec;
export default _default;
//# sourceMappingURL=NativeRNMBXTileStoreModule.d.ts.map