package com.mapbox.rctmgl.components.location

import android.content.Context
import android.graphics.Color
import android.graphics.drawable.VectorDrawable
import androidx.appcompat.content.res.AppCompatResources
import com.mapbox.maps.CameraOptions
import com.mapbox.maps.MapboxMap
import com.mapbox.maps.Style
import com.mapbox.maps.plugin.LocationPuck2D
import com.mapbox.maps.plugin.gestures.gestures
import com.mapbox.maps.plugin.locationcomponent.*
import com.mapbox.rctmgl.R
import com.mapbox.rctmgl.components.mapview.RCTMGLMapView
import com.mapbox.rctmgl.location.LocationManager
import com.mapbox.rctmgl.location.LocationManager.Companion.getInstance

/**
 * The LocationComponent on android implements both location tracking and display of user's current location.
 * LocationComponentManager attempts to separate that, so that Camera can ask for location tracking independent of display of user current location.
 * And NativeUserLocation can ask for display of user's current location - independent of Camera's user tracking.
 */
class LocationComponentManager(rctmglMapView: RCTMGLMapView?, context: Context?) {
    private var mMapView: RCTMGLMapView? = null
    private var mMap: MapboxMap? = null
    private var mLocationManager: LocationManager? = null
    private var mLocationComponent: LocationComponentPlugin? = null
    private var mContext: Context? = null
    private var mCameraMode = CameraMode.NONE

    @RenderMode.Mode
    private var mRenderMode = RenderMode.COMPASS
    private val mLocationBearingChangedListener = OnIndicatorBearingChangedListener { v ->
        if (mFollowUserLocation) {
            mMapView!!.getMapboxMap().setCamera(CameraOptions.Builder().bearing(v).build())
        }
    }
    private val mLocationPositionChangeListener = OnIndicatorPositionChangedListener { point ->
        if (mFollowUserLocation) {
            mMapView!!.getMapboxMap().setCamera(CameraOptions.Builder().center(point).build())
            mMapView!!.gestures.focalPoint = mMapView!!.getMapboxMap().pixelForCoordinate(point)
        }
    }
    private var mShowUserLocation = false
    private var mFollowUserLocation = false
    private var mShowingUserLocation = false
    fun showUserLocation(showUserLocation: Boolean) {
        mShowUserLocation = showUserLocation
        stateChanged()
    }

    fun setFollowUserLocation(followUserLocation: Boolean) {
        mFollowUserLocation = followUserLocation
        stateChanged()
    }

    fun setCameraMode(@CameraMode.Mode cameraMode: Int) {
        mCameraMode = cameraMode
        stateChanged()
        val locationComponent = mMapView!!.location
        if (mCameraMode == CameraMode.NONE || mCameraMode == CameraMode.TRACKING) {
            locationComponent.removeOnIndicatorBearingChangedListener(
                mLocationBearingChangedListener
            )
        } else {
            locationComponent.addOnIndicatorBearingChangedListener(mLocationBearingChangedListener)
        }
        if (mCameraMode == CameraMode.NONE || mCameraMode == CameraMode.NONE_COMPASS || mCameraMode == CameraMode.NONE_GPS) {
            locationComponent.removeOnIndicatorPositionChangedListener(
                mLocationPositionChangeListener
            )
        } else {
            locationComponent.addOnIndicatorPositionChangedListener(mLocationPositionChangeListener)
        }
    }

    fun tintColorChanged() {
        applyOptions(mShowingUserLocation, mLocationComponent)
    }

    fun setRenderMode(@RenderMode.Mode renderMode: Int) {
        mRenderMode = renderMode
    }

    private fun stateChanged() {
        mLocationComponent!!.enabled = mFollowUserLocation || mShowUserLocation
        if (mShowingUserLocation != mShowUserLocation) {
            updateShowUserLocation(mShowUserLocation)
        }
        if (mFollowUserLocation) {
            mLocationComponent!!.onStart()
        }
        mLocationComponent!!.enabled = mFollowUserLocation || mShowUserLocation
    }

    fun hasLocationComponent(): Boolean {
        return mLocationComponent != null
    }

    fun update(style: Style) {
        update(mShowUserLocation)
    }

    fun update(displayUserLocation: Boolean) {
        if (mLocationComponent == null) {
            mLocationComponent = mMapView!!.location
            mLocationComponent!!.setLocationProvider(mLocationManager!!.provider)
            mShowingUserLocation = displayUserLocation
        }
        updateShowUserLocation(displayUserLocation)
    }

    private fun updateShowUserLocation(displayUserLocation: Boolean) {
        if (mShowingUserLocation != displayUserLocation) {
            applyOptions(displayUserLocation, mLocationComponent)
            mShowingUserLocation = displayUserLocation
        }
    }

    private fun applyOptions(
        displayUserLocation: Boolean,
        locationComponent: LocationComponentPlugin?
    ) {
        locationComponent!!.enabled = true
        if (!displayUserLocation) {
            val empty = AppCompatResources.getDrawable(mContext!!, R.drawable.empty)
            locationComponent.updateSettings {
                locationPuck = LocationPuck2D(shadowImage = empty, topImage = empty)
                pulsingEnabled = true
            }
        } else {
            val mapboxBlueColor = Color.parseColor("#4A90E2")
            val tintColor = mMapView!!.tintColor
            locationComponent.updateSettings {
                locationPuck = locationComponent.createDefault2DPuck(mContext!!, true)
                pulsingEnabled = true
                pulsingColor = tintColor ?: mapboxBlueColor
            }
        }
    }

    init {
        mMapView = rctmglMapView
        mMap = mMapView!!.getMapboxMap()
        mContext = context
        mLocationManager = getInstance(context!!)
    }
}