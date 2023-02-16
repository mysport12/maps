package com.mapbox.rctmgl.components.location

import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp
import com.mapbox.rctmgl.utils.Logger
import javax.annotation.Nonnull

class RCTMGLNativeUserLocationManager : ViewGroupManager<RCTMGLNativeUserLocation>() {
    @Nonnull
    override fun getName(): String {
        return REACT_CLASS
    }

    @ReactProp(name = "androidRenderMode")
    fun setAndroidRenderMode(userLocation: RCTMGLNativeUserLocation?, mode: String?) {
        Logger.w("RCTMGLNativeUserLocationManager", "setAndroidRenderMode is deprecated in v10");
    }

    @ReactProp(name = "nativeBearingImage")
    fun setNativeBearingImage(userLocation: RCTMGLNativeUserLocation?, image: ReadableMap) {
        userLocation?.setNativeBearingImage(image);
    }

    @ReactProp(name = "nativeShadowImage")
    fun setNativeShadowImage(userLocation: RCTMGLNativeUserLocation?, image: ReadableMap) {
        userLocation?.setNativeShadowImage(image);
    }

    @ReactProp(name = "nativeTopImage")
    fun setNativeTopImage(userLocation: RCTMGLNativeUserLocation?, image: ReadableMap) {
        userLocation?.setNativeTopImage(image);
    }

    @Nonnull
    override fun createViewInstance(@Nonnull reactContext: ThemedReactContext): RCTMGLNativeUserLocation {
        return RCTMGLNativeUserLocation(reactContext)
    }

    companion object {
        const val REACT_CLASS = "RCTMGLNativeUserLocation"
    }
}