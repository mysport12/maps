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

public class RNMBXImageSourceManagerDelegate<T extends View, U extends BaseViewManager<T, ? extends LayoutShadowNode> & RNMBXImageSourceManagerInterface<T>> extends BaseViewManagerDelegate<T, U> {
  public RNMBXImageSourceManagerDelegate(U viewManager) {
    super(viewManager);
  }
  @Override
  public void setProperty(T view, String propName, @Nullable Object value) {
    switch (propName) {
      case "id":
        mViewManager.setId(view, new DynamicFromObject(value));
        break;
      case "existing":
        mViewManager.setExisting(view, new DynamicFromObject(value));
        break;
      case "url":
        mViewManager.setUrl(view, new DynamicFromObject(value));
        break;
      case "coordinates":
        mViewManager.setCoordinates(view, new DynamicFromObject(value));
        break;
      default:
        super.setProperty(view, propName, value);
    }
  }
}
