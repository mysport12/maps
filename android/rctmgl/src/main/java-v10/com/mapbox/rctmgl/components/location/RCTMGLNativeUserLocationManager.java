package com.mapbox.rctmgl.components.location;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nonnull;

public class RCTMGLNativeUserLocationManager extends ViewGroupManager<RCTMGLNativeUserLocation> {
    public static final String REACT_CLASS = "RCTMGLNativeUserLocation";

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactProp(name = "androidRenderMode")
    public void setAndroidRenderMode(com.mapbox.rctmgl.components.location.RCTMGLNativeUserLocation userLocation,
            String mode) {
        if ("compass".equalsIgnoreCase(mode)) {
            userLocation.setRenderMode(RenderMode.COMPASS);
        } else if ("gps".equalsIgnoreCase(mode)) {
            userLocation.setRenderMode(RenderMode.GPS);
        } else {
            userLocation.setRenderMode(RenderMode.NORMAL);
        }
    }

    @ReactProp(name = "nativeBearingImage")
    public void setNativeBearingImage(com.mapbox.rctmgl.components.location.RCTMGLNativeUserLocation userLocation,
            ReadableMap image) {
        userLocation.setNativeBearingImage(image);
    }

    @ReactProp(name = "nativeShadowImage")
    public void setNativeShadowImage(com.mapbox.rctmgl.components.location.RCTMGLNativeUserLocation userLocation,
            ReadableMap image) {
        userLocation.setNativeShadowImage(image);
    }

    @ReactProp(name = "nativeTopImage")
    public void setNativeTopImage(com.mapbox.rctmgl.components.location.RCTMGLNativeUserLocation userLocation,
            ReadableMap image) {
        userLocation.setNativeTopImage(image);
    }

    @Nonnull
    @Override
    protected RCTMGLNativeUserLocation createViewInstance(@Nonnull ThemedReactContext reactContext) {
        return new RCTMGLNativeUserLocation(reactContext);
    }
}
