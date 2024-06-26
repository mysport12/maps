function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
import React from 'react';
import { NativeModules } from 'react-native';
import RNMBXFillExtrusionLayerNativeComponent from '../specs/RNMBXFillExtrusionLayerNativeComponent';
import AbstractLayer from './AbstractLayer';
const MapboxGL = NativeModules.RNMBXModule;
/**
 * FillExtrusionLayer is a style layer that renders one or more 3D extruded polygons on the map.
 */
class FillExtrusionLayer extends AbstractLayer {
  render() {
    const props = {
      ...this.props,
      ...this.baseProps,
      sourceLayerID: this.props.sourceLayerID
    };
    return /*#__PURE__*/React.createElement(RNMBXFillExtrusionLayerNativeComponent
    // @ts-expect-error just codegen stuff
    , _extends({
      ref: this.setNativeLayer
    }, props));
  }
}
_defineProperty(FillExtrusionLayer, "defaultProps", {
  sourceID: MapboxGL.StyleSource.DefaultSourceID
});
export default FillExtrusionLayer;
//# sourceMappingURL=FillExtrusionLayer.js.map