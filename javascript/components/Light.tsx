import React, {
  Component,
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  HostComponent,
  NativeMethods,
  requireNativeComponent,
} from 'react-native';
import { MutableRefObject } from 'react';

import { LightLayerStyleProps } from '../utils/MapboxStyles';
import { StyleValue } from '../utils/StyleValue';
import { type BaseProps } from '../types/BaseProps';
import { transformStyle } from '../utils/StyleValue';

export const NATIVE_MODULE_NAME = 'RCTMGLLight';

type Props = BaseProps & {
  /**
   * Customizable style attributes
   */
  style: LightLayerStyleProps;
};

type NativeProps = Omit<Props, 'style'> & {
  reactStyle?: { [key: string]: StyleValue };
};

function useNativeRef<P>(): MutableRefObject<
  (Component<P> & Readonly<NativeMethods>) | null
> {
  return useRef<HostComponent<P>>(null) as MutableRefObject<
    (Component<P> & Readonly<NativeMethods>) | null
  >;
}

interface LightMethods {
  setNativeProps(props: { [key: string]: unknown }): void;
}

/**
 * Light represents the light source for extruded geometries
 */
function Light(props: Props, ref: React.ForwardedRef<LightMethods>) {
  const { style, ...propWithoutStyle } = props;

  const nativeLightRef = useNativeRef<NativeProps>();

  useImperativeHandle(ref, () => ({
    setNativeProps(_props: { [key: string]: unknown }) {
      let propsToPass = _props;
      if (_props.style) {
        propsToPass = {
          ..._props,
          reactStyle: transformStyle(_props.style),
        };
      }
      nativeLightRef.current?.setNativeProps(propsToPass);
    },
  }));

  return (
    <RCTMGLLight
      ref={nativeLightRef}
      testID="rctmglLight"
      {...propWithoutStyle}
      reactStyle={transformStyle(style)}
    />
  );
}

const RCTMGLLight = requireNativeComponent<NativeProps>(NATIVE_MODULE_NAME);

export default memo(forwardRef(Light));
