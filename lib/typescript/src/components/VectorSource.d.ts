import React from 'react';
import { NativeSyntheticEvent } from 'react-native';
import { OnPressEvent } from '../types/OnPressEvent';
import AbstractSource from './AbstractSource';
export declare const NATIVE_MODULE_NAME = "RNMBXVectorSource";
interface Props {
    /**
     * A string that uniquely identifies the source.
     */
    id: string;
    /**
     * The id refers to en existing source in the style. Does not create a new source.
     */
    existing?: boolean;
    /**
     * A URL to a TileJSON configuration file describing the source’s contents and other metadata.
     */
    url?: string;
    /**
     * An array of tile URL templates. If multiple endpoints are specified, clients may use any combination of endpoints.
     * Example: https://example.com/vector-tiles/{z}/{x}/{y}.pbf
     */
    tileUrlTemplates?: string[];
    /**
     * An unsigned integer that specifies the minimum zoom level at which to display tiles from the source.
     * The value should be between 0 and 22, inclusive, and less than
     * maxZoomLevel, if specified. The default value for this option is 0.
     */
    minZoomLevel?: number;
    /**
     * An unsigned integer that specifies the maximum zoom level at which to display tiles from the source.
     * The value should be between 0 and 22, inclusive, and less than
     * minZoomLevel, if specified. The default value for this option is 22.
     */
    maxZoomLevel?: number;
    /**
     * Influences the y direction of the tile coordinates. (tms inverts y axis)
     */
    tms?: boolean;
    /**
     * An HTML or literal text string defining the buttons to be displayed in an action sheet when the
     * source is part of a map view’s style and the map view’s attribution button is pressed.
     */
    attribution?: string;
    /**
     * Source press listener, gets called when a user presses one of the children layers only
     * if that layer has a higher z-index than another source layers
     *
     * @param {Object} event
     * @param {Object[]} event.features - the geojson features that have hit by the press (might be multiple)
     * @param {Object} event.coordinates - the coordinates of the click
     * @param {Object} event.point - the point of the click
     */
    onPress?: (event: OnPressEvent) => void;
    /**
     * Overrides the default touch hitbox(44x44 pixels) for the source layers
     */
    hitbox?: {
        /**
         * `width` of hitbox
         */
        width: number;
        /**
         * `height` of hitbox
         */
        height: number;
    };
    children?: React.ReactElement | React.ReactElement[];
}
declare type NativeProps = Props;
/**
 * VectorSource is a map content source that supplies tiled vector data in Mapbox Vector Tile format to be shown on the map.
 * The location of and metadata about the tiles are defined either by an option dictionary or by an external file that conforms to the TileJSON specification.
 */
declare class VectorSource extends AbstractSource<Props, NativeProps> {
    static defaultProps: {
        id: any;
    };
    constructor(props: Props);
    _decodePayload(payload: OnPressEvent | string): OnPressEvent;
    onPress(event: NativeSyntheticEvent<{
        payload: OnPressEvent | string;
    }>): void;
    render(): JSX.Element;
}
export default VectorSource;
//# sourceMappingURL=VectorSource.d.ts.map