function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React, { forwardRef, memo, useImperativeHandle, useRef } from 'react';
import RNMBXLightNativeComponent from '../specs/RNMBXLightNativeComponent';
import { transformStyle } from '../utils/StyleValue';
import nativeRef from '../utils/nativeRef';
/**
 * Light represents the light source for extruded geometries
 */
function Light(props, ref) {
  const {
    style,
    ...propWithoutStyle
  } = props;
  const nativeLightRef = nativeRef(useRef(null));
  useImperativeHandle(ref, () => ({
    setNativeProps(_props) {
      var _nativeLightRef$curre;
      let propsToPass = _props;
      if (_props.style) {
        propsToPass = {
          ..._props,
          reactStyle: transformStyle(_props.style)
        };
      }
      (_nativeLightRef$curre = nativeLightRef.current) === null || _nativeLightRef$curre === void 0 ? void 0 : _nativeLightRef$curre.setNativeProps(propsToPass);
    }
  }));
  return /*#__PURE__*/React.createElement(RNMBXLightNativeComponent
  // @ts-expect-error just codegen stuff
  , _extends({
    ref: nativeLightRef,
    testID: "RNMBXLight"
  }, propWithoutStyle, {
    reactStyle: transformStyle(style)
  }));
}
export default /*#__PURE__*/memo( /*#__PURE__*/forwardRef(Light));
//# sourceMappingURL=Light.js.map