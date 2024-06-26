import { SyntheticEvent } from 'react';
import { Animated } from 'react-native';
import { GeoJsonObject } from 'geojson';
export declare type MapboxGLEvent<T extends string, P = GeoJSON.Feature, V = Element> = SyntheticEvent<V, {
    type: T;
    payload: P;
}>;
export interface AnimatedPoint extends GeoJsonObject {
    readonly type: 'Point';
    coordinates: (Animated.Value | number)[];
}
export interface AnimatedShape extends GeoJsonObject {
    readonly type: 'LineString';
    coordinates: (Animated.Value | number)[][];
}
//# sourceMappingURL=index.d.ts.map