"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.AnimatedExtractCoordinateFromArray = void 0;
var _reactNative = require("react-native");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
// see
// https://github.com/facebook/react-native/blob/master/Libraries/Animated/src/nodes/AnimatedWithChildren.js
const AnimatedWithChildren = Object.getPrototypeOf(_reactNative.Animated.ValueXY);
if (__DEV__) {
  if (AnimatedWithChildren.name !== 'AnimatedWithChildren') {
    console.error('AnimatedCoordinatesArray could not obtain AnimatedWithChildren base class');
  }
}
class AnimatedExtractCoordinateFromArray extends AnimatedWithChildren {
  constructor(array, index) {
    super();
    _defineProperty(this, "_array", null);
    _defineProperty(this, "_index", 0);
    this._array = array;
    this._index = index;
  }
  __getValue() {
    const actArray = this._array.__getValue();
    let index = this._index;
    if (index < 0) {
      index += actArray.length;
    }
    return actArray[index];
  }
  __attach() {
    this._array.__addChild(this);
  }
  __detach() {
    this._array.__removeChild(this);
    super.__detach();
  }
}
exports.AnimatedExtractCoordinateFromArray = AnimatedExtractCoordinateFromArray;
var _default = AnimatedExtractCoordinateFromArray;
exports.default = _default;
//# sourceMappingURL=AnimatedExtractCoordinateFromArray.js.map