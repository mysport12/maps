/**
* This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
*
* Do not edit this file as changes may cause incorrect behavior and will be lost
* once the code is regenerated.
*
* @generated by codegen project: GeneratePropsJavaDelegate.js
*/

package com.facebook.react.viewmanagers;

import android.view.View;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.DynamicFromObject;

import com.facebook.react.uimanager.BaseViewManager;
import com.facebook.react.uimanager.BaseViewManagerDelegate;
import com.facebook.react.uimanager.LayoutShadowNode;

public class RNMBXNativeUserLocationManagerDelegate<T extends View, U extends BaseViewManager<T, ? extends LayoutShadowNode> & RNMBXNativeUserLocationManagerInterface<T>> extends BaseViewManagerDelegate<T, U> {
  public RNMBXNativeUserLocationManagerDelegate(U viewManager) {
    super(viewManager);
  }
  @Override
  public void setProperty(T view, String propName, @Nullable Object value) {
    switch (propName) {
      case "androidRenderMode":
        mViewManager.setAndroidRenderMode(view, new DynamicFromObject(value));
        break;
      case "puckBearing":
        mViewManager.setPuckBearing(view, new DynamicFromObject(value));
        break;
      case "puckBearingEnabled":
        mViewManager.setPuckBearingEnabled(view, new DynamicFromObject(value));
        break;
      case "bearingImage":
        mViewManager.setBearingImage(view, new DynamicFromObject(value));
        break;
      case "shadowImage":
        mViewManager.setShadowImage(view, new DynamicFromObject(value));
        break;
      case "topImage":
        mViewManager.setTopImage(view, new DynamicFromObject(value));
        break;
      case "scale":
        mViewManager.setScale(view, new DynamicFromObject(value));
        break;
      case "visible":
        mViewManager.setVisible(view, value == null ? false : (boolean) value);
        break;
      case "pulsing":
        mViewManager.setPulsing(view, new DynamicFromObject(value));
        break;
      default:
        super.setProperty(view, propName, value);
    }
  }
}
