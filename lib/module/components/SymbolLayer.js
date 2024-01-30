function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
import React from 'react';
import { View, NativeModules } from 'react-native';
import RNMBXSymbolLayerNativeComponent from '../specs/RNMBXSymbolLayerNativeComponent';
import AbstractLayer from './AbstractLayer';
export const NATIVE_MODULE_NAME = 'RNMBXSymbolLayer';
const Mapbox = NativeModules.RNMBXModule;

// @{codepart-replace-start(LayerPropsCommon.codepart-tsx)}

/**
 * SymbolLayer is a style layer that renders icon and text labels at points or along lines on the map.
 */
export class SymbolLayer extends AbstractLayer {
  constructor() {
    super(...arguments);
    _defineProperty(this, "deprecationLogged", {
      snapshot: false
    });
  }
  _shouldSnapshot() {
    let isSnapshot = false;
    if (React.Children.count(this.baseProps.children) <= 0) {
      return isSnapshot;
    }
    React.Children.forEach(this.baseProps.children, child => {
      if ((child === null || child === void 0 ? void 0 : child.type) === View) {
        isSnapshot = true;
      }
    });
    if (isSnapshot && !this.deprecationLogged.snapshot) {
      console.warn('SymbolLayer: passing children for symbol layer is deprecated, please use @rnmapbox/maps Image component instead. https://github.com/rnmapbox/maps/wiki/Deprecated-SymbolLayerChildren');
      this.deprecationLogged.snapshot = true;
    }
    return isSnapshot;
  }
  render() {
    const props = {
      ...this.baseProps,
      snapshot: this._shouldSnapshot(),
      sourceLayerID: this.props.sourceLayerID
    };
    return (
      /*#__PURE__*/
      // @ts-expect-error just codegen stuff
      React.createElement(RNMBXSymbolLayerNativeComponent, _extends({
        ref: this.setNativeLayer
      }, props), this.props.children)
    );
  }
}
_defineProperty(SymbolLayer, "defaultProps", {
  sourceID: Mapbox.StyleSource.DefaultSourceID
});
//# sourceMappingURL=SymbolLayer.js.map