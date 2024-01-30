function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
import React from 'react';
class AbstractSource extends React.PureComponent {
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
export default AbstractSource;
//# sourceMappingURL=AbstractSource.js.map