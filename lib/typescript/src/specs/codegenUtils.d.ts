export declare type UnsafeMixed<T> = T;
export declare type OptionalProp<T> = UnsafeMixed<T>;
import { Double, Int32 } from 'react-native/Libraries/Types/CodegenTypes';
export declare type Point = {
    x: Int32;
    y: Int32;
};
export declare type NativeCameraStop = {
    centerCoordinate?: string;
    bounds?: string;
    heading?: Double;
    pitch?: Double;
    zoom?: Double;
    paddingLeft?: Double;
    paddingRight?: Double;
    paddingTop?: Double;
    paddingBottom?: Double;
    duration?: Double;
    mode?: string;
} | null;
//# sourceMappingURL=codegenUtils.d.ts.map