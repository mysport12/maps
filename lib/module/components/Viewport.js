function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React, { forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { findNodeHandle } from 'react-native';
import NativeViewport from '../specs/RNMBXViewportNativeComponent';
import RNMBXViewportModule from '../specs/NativeRNMBXViewportModule';
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
export const Viewport = /*#__PURE__*/memo( /*#__PURE__*/forwardRef((props, ref) => {
  const commands = useMemo(() => new NativeCommands(RNMBXViewportModule), []);
  const nativeViewport = useRef(null);
  useEffect(() => {
    if (nativeViewport.current) {
      commands.setNativeRef(nativeViewport.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commands, nativeViewport.current]);
  useImperativeHandle(ref, () => ({
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
  const onStatusChangedNative = useMemo(() => {
    const propsOnStatusChanged = props.onStatusChanged;
    if (propsOnStatusChanged != null) {
      return event => {
        propsOnStatusChanged(event.nativeEvent.payload);
      };
    } else {
      return undefined;
    }
  }, [props.onStatusChanged]);
  return /*#__PURE__*/React.createElement(RNMBXViewport, _extends({}, props, {
    hasStatusChanged: props.onStatusChanged != null,
    onStatusChanged: onStatusChangedNative,
    ref: nativeViewport
  }));
}));
const RNMBXViewport = NativeViewport;
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
    const handle = findNodeHandle(nativeRef);
    if (handle) {
      return this.module[name](handle, ...args);
    } else {
      throw new Error(`Could not find handle for native ref ${module} when trying to invoke ${String(name)}`);
    }
  }
}
//# sourceMappingURL=Viewport.js.map