"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.NATIVE_MODULE_NAME = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _RNMBXImagesNativeComponent = _interopRequireDefault(require("../specs/RNMBXImagesNativeComponent"));
var _ShapeSource = require("./ShapeSource");
var _Image = _interopRequireDefault(require("./Image"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
const NATIVE_MODULE_NAME = 'RNMBXImages';
exports.NATIVE_MODULE_NAME = NATIVE_MODULE_NAME;
function _isUrlOrPath(value) {
  return (typeof value === 'string' || value instanceof String) && (value.startsWith('file://') || value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:') || value.startsWith('asset://') || value.startsWith('/'));
}
function isImageSourcePropType(value) {
  if (typeof value === 'number' || value instanceof Number) {
    return true;
  }
  const valueAsSource = value;
  return !!valueAsSource.uri && typeof valueAsSource.uri === 'string';
}
const isChildAnImage = child => {
  return /*#__PURE__*/_react.default.isValidElement(child) && child.type === _Image.default;
};
/**
 * Images defines the images used in Symbol etc. layers.
 */
class Images extends _react.default.PureComponent {
  _getImages() {
    if (!this.props.images && !this.props.nativeAssetImages) {
      return {};
    }
    const images = {};
    let nativeImages = [];
    if (this.props.images) {
      const imageNames = Object.keys(this.props.images);
      for (const imageName of imageNames) {
        const value = this.props.images[imageName];
        if (imageName === _ShapeSource.ShapeSource.NATIVE_ASSETS_KEY && Array.isArray(value)) {
          console.error(`Use of ${_ShapeSource.ShapeSource.NATIVE_ASSETS_KEY} in Images#images is not supported use Images#nativeAssetImages`);
        } else if (_isUrlOrPath(value)) {
          images[imageName] = value;
        } else if (isImageSourcePropType(value)) {
          const res = _reactNative.Image.resolveAssetSource(value);
          if (res && res.uri) {
            images[imageName] = res;
          }
        } else {
          let imageEntry = value;
          if (imageEntry.image) {
            imageEntry = {
              ...imageEntry,
              resolvedImage: _reactNative.Image.resolveAssetSource(imageEntry.image)
            };
          }
          images[imageName] = imageEntry;
        }
      }
    }
    const {
      children
    } = this.props;
    if (children) {
      const childrenWithWrongType = _react.default.Children.toArray(children).find(child => !isChildAnImage(child));
      if (childrenWithWrongType) {
        console.error(`Images component on accepts Image a children passed in: ${childrenWithWrongType.type || 'n/a'}`);
      }
    }
    if (this.props.nativeAssetImages) {
      nativeImages = this.props.nativeAssetImages;
    }
    return {
      images,
      nativeImages
    };
  }
  _onImageMissing(event) {
    if (this.props.onImageMissing) {
      this.props.onImageMissing(event.nativeEvent.payload.imageKey);
    }
  }
  render() {
    const props = {
      hasOnImageMissing: !!this.props.onImageMissing,
      onImageMissing: this._onImageMissing.bind(this),
      ...this._getImages()
    };
    return (
      /*#__PURE__*/
      // @ts-expect-error just codegen stuff
      _react.default.createElement(_RNMBXImagesNativeComponent.default, props, this.props.children)
    );
  }
}
_defineProperty(Images, "NATIVE_ASSETS_KEY", 'assets');
var _default = Images;
exports.default = _default;
//# sourceMappingURL=Images.js.map