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

public class RNMBXFillLayerManagerDelegate<T extends View, U extends BaseViewManager<T, ? extends LayoutShadowNode> & RNMBXFillLayerManagerInterface<T>> extends BaseViewManagerDelegate<T, U> {
  public RNMBXFillLayerManagerDelegate(U viewManager) {
    super(viewManager);
  }
  @Override
  public void setProperty(T view, String propName, @Nullable Object value) {
    switch (propName) {
      case "sourceID":
        mViewManager.setSourceID(view, new DynamicFromObject(value));
        break;
      case "existing":
        mViewManager.setExisting(view, new DynamicFromObject(value));
        break;
      case "filter":
        mViewManager.setFilter(view, new DynamicFromObject(value));
        break;
      case "aboveLayerID":
        mViewManager.setAboveLayerID(view, new DynamicFromObject(value));
        break;
      case "belowLayerID":
        mViewManager.setBelowLayerID(view, new DynamicFromObject(value));
        break;
      case "layerIndex":
        mViewManager.setLayerIndex(view, new DynamicFromObject(value));
        break;
      case "maxZoomLevel":
        mViewManager.setMaxZoomLevel(view, new DynamicFromObject(value));
        break;
      case "minZoomLevel":
        mViewManager.setMinZoomLevel(view, new DynamicFromObject(value));
        break;
      case "sourceLayerID":
        mViewManager.setSourceLayerID(view, new DynamicFromObject(value));
        break;
      case "slot":
        mViewManager.setSlot(view, new DynamicFromObject(value));
        break;
      case "id":
        mViewManager.setId(view, new DynamicFromObject(value));
        break;
      case "reactStyle":
        mViewManager.setReactStyle(view, new DynamicFromObject(value));
        break;
      default:
        super.setProperty(view, propName, value);
    }
  }
}
