package com.mapbox.rctmgl.components.location

import android.annotation.SuppressLint
import android.content.Context
import com.facebook.react.bridge.ReadableMap
import com.mapbox.rctmgl.components.mapview.OnMapReadyCallback
import com.mapbox.maps.MapboxMap
import com.mapbox.android.core.permissions.PermissionsManager
import com.mapbox.maps.Style
import com.mapbox.rctmgl.components.AbstractMapFeature
import com.mapbox.rctmgl.components.mapview.RCTMGLMapView

class RCTMGLNativeUserLocation(context: Context?) : AbstractMapFeature(context), OnMapReadyCallback, Style.OnStyleLoaded {
    private var mEnabled = true
    private var mMap: MapboxMap? = null

    private var mNativeBearingImage : String? = null
    private var mNativeShadowImage : String? = null
    private var mNativeTopImage : String? = null

    override fun addToMap(mapView: RCTMGLMapView) {
        super.addToMap(mapView)
        mEnabled = true
        mapView.getMapboxMap()
        mapView.getMapAsync(this)
        mMapView?.locationComponentManager?.setNativeBearingImage(mNativeBearingImage)
        mMapView?.locationComponentManager?.setNativeShadowImage(mNativeShadowImage)
        mMapView?.locationComponentManager?.setNativeTopImage(mNativeTopImage)
        mMapView?.locationComponentManager?.showNativeUserLocation(true)
    }

    override fun removeFromMap(mapView: RCTMGLMapView) {
        mEnabled = false
        mMapView?.locationComponentManager?.showNativeUserLocation(false)
        mMap?.getStyle(this)
        super.removeFromMap(mapView)
    }

    @SuppressLint("MissingPermission")
    override fun onMapReady(mapboxMap: MapboxMap) {
        mMap = mapboxMap
        mapboxMap.getStyle(this)
    }

    @SuppressLint("MissingPermission")
    override fun onStyleLoaded(style: Style) {
        val context = context
        if (!PermissionsManager.areLocationPermissionsGranted(context)) {
            return
        }

        mMapView?.locationComponentManager?.update(style)
        mMapView?.locationComponentManager?.showNativeUserLocation(mEnabled)
    }

    fun setNativeBearingImage(image: ReadableMap?) {
        val uri = image?.getString("uri")!!
        if (mNativeBearingImage != uri) {
            mMapView?.locationComponentManager?.setNativeBearingImage(uri)
        }
        mNativeBearingImage = uri
    }

    fun setNativeShadowImage(image: ReadableMap?) {
        val uri = image?.getString("uri")!!
        if (mNativeShadowImage != uri) {
            mMapView?.locationComponentManager?.setNativeShadowImage(uri)
        }
        mNativeShadowImage = uri
    }

    fun setNativeTopImage(image: ReadableMap?) {
        val uri = image?.getString("uri")!!
        if (mNativeTopImage != uri) {
            mMapView?.locationComponentManager?.setNativeTopImage(uri)
        }
        mNativeTopImage = uri
    }
}