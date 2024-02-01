"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Viewport = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _RNMBXViewportNativeComponent = _interopRequireDefault(require("../specs/RNMBXViewportNativeComponent"));
var _NativeRNMBXViewportModule = _interopRequireDefault(require("../specs/NativeRNMBXViewportModule"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/**
 * provides a structured approach to organizing camera management logic into states and transitions between them.
 *
 * At any given time, the viewport is either:
 *  - idle
 *  - in a state (camera is being managed by a ViewportState)
 *  - transitioning between states
 *
 * See [android](https://docs.mapbox.com/android/maps/api/${ANDROID_SDK_VERSION}/mapbox-maps-android/com.mapbox.maps.plugin.viewport/viewport.html),
 * [ios](https://docs.mapbox.com/ios/maps/api/${IOS_SDK_VERSION}/Viewport.html#/s:10MapboxMaps8ViewportC)
 */
const Viewport = /*#__PURE__*/(0, _react.memo)( /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  const commands = (0, _react.useMemo)(() => new NativeCommands(_NativeRNMBXViewportModule.default), []);
  const nativeViewport = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    if (nativeViewport.current) {
      commands.setNativeRef(nativeViewport.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commands, nativeViewport.current]);
  (0, _react.useImperativeHandle)(ref, () => ({
    getState() {
      console.log(' => calling getState');
      return commands.call('getState', []);
    },
    async idle() {
      return commands.call('idle', []);
    },
    transitionTo(state, transition) {
      return commands.call('transitionTo', [state, transition]);
    }
  }));
  const onStatusChangedNative = (0, _react.useMemo)(() => {
    const propsOnStatusChanged = props.onStatusChanged;
    if (propsOnStatusChanged != null) {
      return event => {
        propsOnStatusChanged(event.nativeEvent.payload);
      };
    } else {
      return undefined;
    }
  }, [props.onStatusChanged]);
  return /*#__PURE__*/_react.default.createElement(RNMBXViewport, _extends({}, props, {
    hasStatusChanged: props.onStatusChanged != null,
    onStatusChanged: onStatusChangedNative,
    ref: nativeViewport
  }));
}));
exports.Viewport = Viewport;
const RNMBXViewport = _RNMBXViewportNativeComponent.default;
class NativeCommands {
  constructor(module) {
    this.module = module;
    this.preRefMethodQueue = [];
  }
  async setNativeRef(nativeRef) {
    if (nativeRef) {
      this.nativeRef = nativeRef;
      while (this.preRefMethodQueue.length > 0) {
        const item = this.preRefMethodQueue.pop();
        if (item && item.method && item.resolver) {
          const res = await this._call(item.method.name, nativeRef, item.method.args);
          item.resolver(res);
        }
      }
    }
  }
  call(name, args) {
    if (this.nativeRef) {
      return this._call(name, this.nativeRef, args);
    } else {
      return new Promise(resolve => {
        this.preRefMethodQueue.push({
          method: {
            name,
            args
          },
          resolver: resolve
        });
      });
    }
  }
  _call(name, nativeRef, args) {
    const handle = (0, _reactNative.findNodeHandle)(nativeRef);
    if (handle) {
      return this.module[name](handle, ...args);
    } else {
      throw new Error(`Could not find handle for native ref ${module} when trying to invoke ${String(name)}`);
    }
  }
}
//# sourceMappingURL=Viewport.js.map