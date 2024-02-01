function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
import React from 'react';
import { NativeModules } from 'react-native';
import RNMBXFillLayerNativeComponent from '../specs/RNMBXFillLayerNativeComponent';
import AbstractLayer from './AbstractLayer';
const Mapbox = NativeModules.RNMBXModule;

// @{codepart-replace-start(LayerPropsCommon.codepart-tsx)}

/**
 * FillLayer is a style layer that renders one or more filled (and optionally stroked) polygons on the map.
 */
class FillLayer extends AbstractLayer {
  render() {
    const props = {
      ...this.baseProps,
      sourceLayerID: this.props.sourceLayerID
    };
    return (
      /*#__PURE__*/
      // @ts-expect-error just codegen stuff
      React.createElement(RNMBXFillLayerNativeComponent, _extends({
        ref: this.setNativeLayer
      }, props))
    );
  }
}
_defineProperty(FillLayer, "defaultProps", {
  sourceID: Mapbox.StyleSource.DefaultSourceID
});
export default FillLayer;
//# sourceMappingURL=FillLayer.js.map