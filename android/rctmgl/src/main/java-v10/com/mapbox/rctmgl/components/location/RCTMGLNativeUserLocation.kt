package com.mapbox.rctmgl.components.location

import android.annotation.SuppressLint
import android.content.Context
import com.facebook.react.bridge.ReadableMap
import androidx.appcompat.content.res.AppCompatResources
import com.mapbox.rctmgl.components.mapview.OnMapReadyCallback
import com.mapbox.maps.MapboxMap
import com.mapbox.android.core.permissions.PermissionsManager
import com.mapbox.maps.Style
import com.mapbox.maps.plugin.PuckBearingSource
import com.mapbox.rctmgl.R
import com.mapbox.rctmgl.components.AbstractMapFeature
import com.mapbox.rctmgl.components.mapview.RCTMGLMapView
import com.mapbox.rctmgl.utils.ResourceUtils

enum class RenderMode {
    GPS, COMPASS, NORMAL
}

class RCTMGLNativeUserLocation(context: Context) : AbstractMapFeature(context), OnMapReadyCallback, Style.OnStyleLoaded {
    private var mEnabled = true
    private var mMap: MapboxMap? = null
    private var mRenderMode : RenderMode = RenderMode.NORMAL;
    private var mContext : Context = context

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
        applyChanges()
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
        applyChanges()
    }

    fun setAndroidRenderMode(renderMode: RenderMode) {
        mRenderMode = renderMode;
        applyChanges();
    }

    @SuppressLint("MissingPermission")
    override fun onStyleLoaded(style: Style) {
        val context = context
        if (!PermissionsManager.areLocationPermissionsGranted(context)) {
            return
        }

        mMapView?.locationComponentManager?.update()
        mMapView?.locationComponentManager?.showNativeUserLocation(mEnabled)
    }

    fun setNativeBearingImage(image: ReadableMap?) {
        val uri = image?.getString("uri")!!
        if (mNativeBearingImage != uri) {
            mMapView?.locationComponentManager?.setNativeBearingImage(uri)
        }
        mNativeBearingImage = uri
        applyChanges()
    }

    fun setNativeShadowImage(image: ReadableMap?) {
        val uri = image?.getString("uri")!!
        if (mNativeShadowImage != uri) {
            mMapView?.locationComponentManager?.setNativeShadowImage(uri)
        }
        mNativeShadowImage = uri
        applyChanges()
    }

    fun setNativeTopImage(image: ReadableMap?) {
        val uri = image?.getString("uri")!!
        if (mNativeTopImage != uri) {
            mMapView?.locationComponentManager?.setNativeTopImage(uri)
        }
        mNativeTopImage = uri
        applyChanges()

    fun applyChanges() {
        mMapView?.locationComponentManager?.let {
            // emulate https://docs.mapbox.com/android/legacy/maps/guides/location-component/
            when (mRenderMode) {
                RenderMode.NORMAL ->
                    it.update { it.copy(bearingImage = null, puckBearingSource = null)}
                RenderMode.GPS -> it.update {
                    it.copy(
                        bearingImage = if (mNativeBearingImage != null) ResourceUtils.getDrawableByName(mContext, mNativeBearingImage) else AppCompatResources.getDrawable(mContext, R.drawable.mapbox_user_bearing_icon),
                        shadowImage = if (mNativeShadowImage != null) ResourceUtils.getDrawableByName(mContext, mNativeShadowImage) else AppCompatResources.getDrawable(mContext, R.drawable.mapbox_user_icon_shadow),
                        topImage = if (mNativeTopImage != null) ResourceUtils.getDrawableByName(mContext, mNativeTopImage) else AppCompatResources.getDrawable(mContext, R.drawable.mapbox_user_icon),
                        puckBearingSource = PuckBearingSource.COURSE
                    )
                }
                RenderMode.COMPASS -> it.update{
                    it.copy(
                        bearingImage = if (mNativeBearingImage != null) ResourceUtils.getDrawableByName(mContext, mNativeBearingImage) else AppCompatResources.getDrawable(mContext, R.drawable.mapbox_user_puck_icon),
                        shadowImage = if (mNativeShadowImage != null) ResourceUtils.getDrawableByName(mContext, mNativeShadowImage) else AppCompatResources.getDrawable(mContext, R.drawable.mapbox_user_icon_shadow),
                        topImage = if (mNativeTopImage != null) ResourceUtils.getDrawableByName(mContext, mNativeTopImage) else AppCompatResources.getDrawable(mContext, R.drawable.mapbox_user_icon),
                        puckBearingSource = PuckBearingSource.HEADING
                    )
                }
            }
        }
    }
}