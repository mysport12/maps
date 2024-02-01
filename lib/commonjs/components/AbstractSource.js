"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
class AbstractSource extends _react.default.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "setNativeRef", instance => {
      this._nativeRef = instance;
    });
  }
  setNativeProps(props) {
    if (this._nativeRef) {
      this._nativeRef.setNativeProps(props);
    }
  }
}
var _default = AbstractSource;
exports.default = _default;
//# sourceMappingURL=AbstractSource.js.map