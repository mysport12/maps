package com.mapbox.rctmgl.components.location

import android.content.Context
import android.graphics.Color
import android.graphics.drawable.Drawable
import android.graphics.drawable.VectorDrawable
import androidx.appcompat.content.res.AppCompatResources
import com.mapbox.maps.plugin.locationcomponent.location
import com.mapbox.rctmgl.components.mapview.RCTMGLMapView
import com.mapbox.maps.Style
import com.mapbox.maps.plugin.LocationPuck2D
import com.mapbox.maps.plugin.PuckBearingSource
import com.mapbox.rctmgl.R
import com.mapbox.rctmgl.location.LocationManager
import com.mapbox.rctmgl.utils.ResourceUtils

/**
 * The LocationComponent on android implements display of user's current location.
 * But viewport seems to be tied to it in the sense that if location is not enbabled then it's viewport user tracking is not working.
 * LocationComponentManager attempts to separate that, so that Camera can ask for location tracking independent of display of user current location.
 * And NativeUserLocation can ask for display of user's current location - independent of Camera's user tracking.
 */
class LocationComponentManager(mapView: RCTMGLMapView, context: Context) {
    private var mShowNativeUserLocation = false
    private var mFollowLocation = false
    private var mNativeBearingImage : Drawable? = null
    private var mNativeShadowImage : Drawable? = null
    private var mNativeTopImage : Drawable? = null
    private var mPuckBearingSource: PuckBearingSource? = null
    var mMapView = mapView
    var mContext = context
    var mState = State(enabled=true, hidden=false, tintColor= null)
    var mLocationManager: LocationManager? = LocationManager.getInstance(context!!)

    data class State(
        val enabled: Boolean, // in case followUserLocation is active or visible
        val hidden: Boolean, // in case it isn't native
        val tintColor: Int?, // tint of location puck
    )

    fun showNativeUserLocation(showUserLocation: Boolean) {
        mShowNativeUserLocation = showUserLocation

        _applyChanges(false)
    }

    fun setFollowLocation(followLoation: Boolean) {
        mFollowLocation = followLoation

        _applyChanges(false)
    }

    fun update(style: Style) {
        _applyChanges(false)
    }

    fun setNativeBearingImage(name: String?) {
        if (name != null) {
            mNativeBearingImage = ResourceUtils.getDrawableByName(mContext, name)
        } else {
            mNativeBearingImage = null
        }
        _applyChanges(true)
    }

    fun setNativeShadowImage(name: String?) {
        if (name != null) {
            mNativeShadowImage = ResourceUtils.getDrawableByName(mContext, name)
        } else {
            mNativeShadowImage = null
        }
        _applyChanges(true)
    }

    fun setNativeTopImage(name: String?) {
        if (name != null) {
            mNativeTopImage = ResourceUtils.getDrawableByName(mContext, name)
        } else {
            mNativeTopImage = null
        }
        _applyChanges(true)
    }

    fun _applyChanges(forceRefresh: Boolean) {
        mMapView?.let {
            val newState = State(
                enabled = mShowNativeUserLocation || mFollowLocation,
                hidden = !mShowNativeUserLocation,
                tintColor = mMapView!!.tintColor,
            )

            if (!mState.equals(newState) || forceRefresh) {
                it.location.updateSettings {
                    val trackLocation = true
                    enabled = newState.enabled

                    if ((newState.hidden != mState.hidden) || (newState.tintColor != mState.tintColor) || forceRefresh) {
                        if (newState.hidden) {
                            var emptyLocationPuck = LocationPuck2D()
                            val empty = AppCompatResources.getDrawable(mContext!!, R.drawable.empty)
                            emptyLocationPuck.bearingImage = empty
                            emptyLocationPuck.shadowImage = empty
                            emptyLocationPuck.topImage = empty
                            //emptyLocationPuck.opacity = 0.0
                            locationPuck = emptyLocationPuck
                            pulsingEnabled = false
                        } else {
                            val mapboxBlueColor = Color.parseColor("#4A90E2")
                            val tintColor = newState.tintColor
                            val defaultLocationPuck = LocationPuck2D()
                            var topImage = mNativeTopImage ?: AppCompatResources.getDrawable(mContext!!, R.drawable.mapbox_user_icon)
                            if (tintColor != null) {
                                val drawable = topImage as VectorDrawable?
                                drawable!!.setTint(tintColor)
                                topImage = drawable
                            }
                            defaultLocationPuck.topImage = topImage
                            val bearingImage = mNativeBearingImage ?: AppCompatResources.getDrawable(
                                mContext!!, R.drawable.mapbox_user_stroke_icon
                            )
                            defaultLocationPuck.bearingImage = bearingImage
                            val shadowImage = mNativeShadowImage ?: AppCompatResources.getDrawable(
                                mContext!!, R.drawable.mapbox_user_icon_shadow
                            )
                            defaultLocationPuck.shadowImage = shadowImage
                            locationPuck = defaultLocationPuck
                            pulsingEnabled = true
                            if (tintColor != null) {
                                pulsingColor = tintColor
                            } else {
                                pulsingColor = mapboxBlueColor
                            }
                        }
                    }
                }

                if (newState.enabled != mState.enabled) {
                    if (newState.enabled) {
                        mLocationManager?.startCounted()
                        val provider = it.location.getLocationProvider()
                        if (provider != null) {
                            mLocationManager?.provider = provider
                        }
                    } else {
                        mLocationManager?.stopCounted()
                    }
                }

                mState = newState;
            }


        }
    }
}