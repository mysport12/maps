function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
import React from 'react';
import { NativeModules, Platform } from 'react-native';
import RNMBXMakerViewContentCoponent from '../specs/RNMBXMarkerViewContentNativeComponent';
import NativeMarkerViewComponent from '../specs/RNMBXMarkerViewNativeComponent';
import { toJSONString } from '../utils';
import { makePoint } from '../utils/geoUtils';
import PointAnnotation from './PointAnnotation';
const Mapbox = NativeModules.RNMBXModule;
/**
 * MarkerView represents an interactive React Native marker on the map.
 *
 * If you have static views, consider using PointAnnotation or SymbolLayer to display
 * an image, as they'll offer much better performance. Mapbox suggests using this
 * component for a maximum of around 100 views displayed at one time.
 *
 * This is implemented with view annotations on [Android](https://docs.mapbox.com/android/maps/guides/annotations/view-annotations/)
 * and [iOS](https://docs.mapbox.com/ios/maps/guides/annotations/view-annotations).
 *
 * This component has no dedicated `onPress` method. Instead, you should handle gestures
 * with the React views passed in as `children`.
 */
class MarkerView extends React.PureComponent {
  _idForPointAnnotation() {
    if (this.__idForPointAnnotation === undefined) {
      MarkerView.lastId = MarkerView.lastId + 1;
      this.__idForPointAnnotation = `MV-${MarkerView.lastId}`;
    }
    return this.__idForPointAnnotation;
  }
  _getCoordinate(coordinate) {
    if (!coordinate) {
      return undefined;
    }
    return toJSONString(makePoint(coordinate));
  }
  render() {
    if (this.props.anchor.x < 0 || this.props.anchor.y < 0 || this.props.anchor.x > 1 || this.props.anchor.y > 1) {
      console.warn(`[MarkerView] Anchor with value (${this.props.anchor.x}, ${this.props.anchor.y}) should not be outside the range [(0, 0), (1, 1)]`);
    }
    if (Platform.OS === 'ios' && !Mapbox.MapboxV10) {
      return /*#__PURE__*/React.createElement(PointAnnotation, _extends({
        id: this._idForPointAnnotation()
      }, this.props));
    }
    const {
      anchor = {
        x: 0.5,
        y: 0.5
      }
    } = this.props;
    return /*#__PURE__*/React.createElement(RNMBXMarkerView, {
      style: [{
        flex: 0,
        alignSelf: 'flex-start'
      }, this.props.style],
      coordinate: [Number(this.props.coordinate[0]), Number(this.props.coordinate[1])],
      anchor: anchor,
      allowOverlap: this.props.allowOverlap,
      allowOverlapWithPuck: this.props.allowOverlapWithPuck,
      isSelected: this.props.isSelected,
      onTouchEnd: e => {
        e.stopPropagation();
      }
    }, /*#__PURE__*/React.createElement(RNMBXMakerViewContentCoponent, {
      style: {
        flex: 0,
        alignSelf: 'flex-start'
      },
      onStartShouldSetResponder: _event => {
        return true;
      },
      onTouchEnd: e => {
        e.stopPropagation();
      }
    }, this.props.children));
  }
}
_defineProperty(MarkerView, "defaultProps", {
  anchor: {
    x: 0.5,
    y: 0.5
  },
  allowOverlap: false,
  allowOverlapWithPuck: false,
  isSelected: false
});
_defineProperty(MarkerView, "lastId", 0);
const RNMBXMarkerView = NativeMarkerViewComponent;
export default MarkerView;
//# sourceMappingURL=MarkerView.js.map