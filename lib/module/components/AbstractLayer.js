function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
import React from 'react';
import { processColor } from 'react-native';
import { getFilter } from '../utils/filterUtils';
import { transformStyle } from '../utils/StyleValue';
class AbstractLayer extends React.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "nativeLayer", null);
    _defineProperty(this, "setNativeLayer", instance => {
      this.nativeLayer = instance;
    });
  }
  get baseProps() {
    return {
      ...this.props,
      id: this.props.id,
      existing: this.props.existing,
      sourceID: this.props.sourceID,
      reactStyle: this.getStyle(this.props.style),
      minZoomLevel: this.props.minZoomLevel,
      maxZoomLevel: this.props.maxZoomLevel,
      aboveLayerID: this.props.aboveLayerID,
      belowLayerID: this.props.belowLayerID,
      layerIndex: this.props.layerIndex,
      filter: getFilter(this.props.filter),
      style: undefined
    };
  }
  getStyleTypeFormatter(styleType) {
    if (styleType === 'color') {
      return processColor;
    }
    return undefined;
  }
  getStyle(style) {
    return transformStyle(style);
  }
  setNativeProps(props) {
    if (this.nativeLayer) {
      var _this$nativeLayer;
      let propsToPass = props;
      if (props.style) {
        propsToPass = {
          ...props,
          reactStyle: this.getStyle(props.style)
        };
      }
      (_this$nativeLayer = this.nativeLayer) === null || _this$nativeLayer === void 0 ? void 0 : _this$nativeLayer.setNativeProps(propsToPass);
    }
  }
}
export default AbstractLayer;
//# sourceMappingURL=AbstractLayer.js.map