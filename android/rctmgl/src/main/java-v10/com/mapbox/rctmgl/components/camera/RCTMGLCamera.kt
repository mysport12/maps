package com.mapbox.rctmgl.components.camera

import android.animation.Animator
import android.content.Context
import android.location.Location
import com.mapbox.rctmgl.utils.GeoJSONUtils.toPoint
import com.mapbox.rctmgl.location.LocationManager.Companion.getInstance
import com.mapbox.rctmgl.utils.GeoJSONUtils.toLocation
import com.mapbox.rctmgl.components.AbstractMapFeature
import com.mapbox.rctmgl.components.mapview.RCTMGLMapView
import com.mapbox.rctmgl.components.location.LocationComponentManager
import com.mapbox.rctmgl.utils.LatLngBounds
import com.mapbox.rctmgl.location.LocationManager.OnUserLocationChange
import com.mapbox.rctmgl.events.IEvent
import com.mapbox.rctmgl.events.MapChangeEvent
import com.mapbox.rctmgl.events.constants.EventTypes
import com.mapbox.android.core.permissions.PermissionsManager
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.mapbox.geojson.Point
import com.mapbox.maps.*
import com.mapbox.maps.plugin.PuckBearingSource
import com.mapbox.maps.plugin.locationcomponent.location
import com.mapbox.maps.plugin.locationcomponent.location2
import com.mapbox.maps.plugin.viewport.data.DefaultViewportTransitionOptions
import com.mapbox.maps.plugin.viewport.data.FollowPuckViewportStateBearing
import com.mapbox.maps.plugin.viewport.data.FollowPuckViewportStateOptions
import com.mapbox.maps.plugin.viewport.viewport
import com.mapbox.rctmgl.components.camera.constants.CameraMode
import com.mapbox.rctmgl.components.location.*
import com.mapbox.rctmgl.location.*
import com.mapbox.rctmgl.utils.Logger

class RCTMGLCamera(private val mContext: Context, private val mManager: RCTMGLCameraManager) :
    AbstractMapFeature(
        mContext
    ) {
    private var hasSentFirstRegion = false
    private var mDefaultStop: CameraStop? = null
    private var mCameraStop: CameraStop? = null
    private val mCameraUpdateQueue: CameraUpdateQueue = CameraUpdateQueue()

    /*
    // private LocationComponent mLocationComponent;
     */
    private var mLocationComponentManager: LocationComponentManager? = null
    private var mUserTrackingMode = 0
    private val mLocationManager: LocationManager?
    private val mUserLocation: UserLocation = UserLocation()
    private var mAnimationDuration : Long? = null
    private var mFollowPitch : Double? = null
    private var mFollowZoomLevel : Double? = null
    private var mFollowHeading : Double? = null
    private var mMinZoomLevel : Double? = null
    private var mMaxZoomLevel : Double? = null
    private var mMaxBounds: LatLngBounds? = null
    private var mFollowUserLocation = false
    private var mFollowUserMode: String? = null
    private val mLocationChangeListener: OnUserLocationChange = object : OnUserLocationChange {
        override fun onLocationChange(location: Location?) {
            if (mapboxMap == null || mLocationComponentManager == null || !mLocationComponentManager!!.hasLocationComponent() || !mFollowUserLocation) {
                return
            }
            mUserLocation.currentLocation = location
            sendUserLocationUpdateEvent(toPoint(location!!))
        }
    }
    private val mCameraCallback: Animator.AnimatorListener = object : Animator.AnimatorListener {
        override fun onAnimationStart(animator: Animator) {}
        override fun onAnimationEnd(animator: Animator) {
            if (!hasSentFirstRegion) {
                mMapView!!.sendRegionChangeEvent(false)
                hasSentFirstRegion = true
            }
        }

        override fun onAnimationCancel(animator: Animator) {
            if (!hasSentFirstRegion) {
                mMapView!!.sendRegionChangeEvent(false)
                hasSentFirstRegion = true
            }
        }

        override fun onAnimationRepeat(animator: Animator) {}
    }

    override fun addToMap(mapView: RCTMGLMapView) {
        super.addToMap(mapView)
        setInitialCamera()
        updateMaxBounds()
        mCameraStop?.let { updateCamera(it) }
        if (mFollowUserLocation) {
            // updateFollowLocation(mFollowUserLocation);
            enableLocation()
        }
    }

    fun setStop(stop: CameraStop) {
        mCameraStop = stop
        mCameraStop!!.setCallback(mCameraCallback)
        if (mMapView != null) {
            mCameraStop?.let { updateCamera(it) }
        }
    }

    fun setAnimationDuration(duration: Int?) {
        if (duration != null) {
            mAnimationDuration = duration.toLong()
        }
    }

    fun setDefaultStop(stop: CameraStop?) {
        mDefaultStop = stop
    }

    fun setFollowPitch(pitch: Double) {
        mFollowPitch = pitch
        updateViewportState()
    }

    fun setFollowZoomLevel(zoomLevel: Double) {
        mFollowZoomLevel = zoomLevel
        updateViewportState()
    }

    fun setFollowHeading(heading: Double) {
        mFollowHeading = heading
        updateViewportState()
    }

    fun setMaxBounds(bounds: LatLngBounds?) {
        mMaxBounds = bounds
        updateMaxBounds()
    }


    private fun updateMaxBounds() {
        withMapView { mapView ->
            val map = mapView.getMapboxMap()
            val maxBounds = mMaxBounds
            val builder = CameraBoundsOptions.Builder()

            if (maxBounds != null) {
                builder.bounds(maxBounds.toBounds())
            }
            mMinZoomLevel?.let { builder.minZoom(it) }
            mMaxZoomLevel?.let { builder.maxZoom(it) }
            map.setBounds(builder.build())
        }
    }

    private fun setInitialCamera() {
        if (mDefaultStop != null) {
            mDefaultStop!!.setDuration(0)
            mDefaultStop!!.setMode(CameraMode.NONE)
            val item = mDefaultStop!!.toCameraUpdate(mMapView!!)
            item.run()
        }
    }

    private fun updateCamera(cameraStop: CameraStop) {
        mCameraUpdateQueue.offer(cameraStop)
        mCameraUpdateQueue.execute(mMapView)
    }

    private fun sendUserLocationUpdateEvent(point: Point?) {
        if (point == null) {
            return
        }
        val event: IEvent = MapChangeEvent(
            this, EventTypes.USER_LOCATION_UPDATED, makeLocationChangePayload(
                toLocation(point)
            )
        )
        mManager.handleEvent(event)
    }

    init {
        mLocationManager = getInstance(mContext)
    }

    private fun enableLocation() {
        if (!PermissionsManager.areLocationPermissionsGranted(mContext)) {
            return
        }
        if (!mLocationManager!!.isActive()) {
            mLocationManager.enable()
        }
        mMapView!!.getMapboxMap().getStyle {
            enableLocationComponent(it)
        }
    }

    private fun enableLocationComponent(style: Style) {
        updateLocationLayer(style)
        val lastKnownLocation = mLocationManager!!.lastKnownLocation
        mLocationManager.addLocationListener(mLocationChangeListener)
        if (lastKnownLocation != null) {
            mLocationChangeListener.onLocationChange(lastKnownLocation)
            postDelayed({ mMapView!!.sendRegionDidChangeEvent() }, 200)
        }
    }

    private fun updateLocationLayer(style: Style) {
        if (mLocationComponentManager == null) {
            mLocationComponentManager = mMapView!!.locationComponentManager
        }
        mLocationComponentManager!!.update(style)
        if (mFollowUserLocation) {
            mLocationComponentManager!!.setCameraMode(
                UserTrackingMode.getCameraMode(
                    mUserTrackingMode
                )
            )
        }
        mLocationComponentManager!!.setFollowUserLocation(mFollowUserLocation)
        if (mFollowUserLocation) {
            mLocationComponentManager!!.setCameraMode(
                UserTrackingMode.getCameraMode(
                    mUserTrackingMode
                )
            )
        } else {
            mLocationComponentManager!!.setCameraMode(com.mapbox.rctmgl.components.location.CameraMode.NONE)
        }
    }

    fun setMinZoomLevel(zoomLevel: Double?) {
        mMinZoomLevel = zoomLevel
        updateMaxBounds()
    }

    fun setMaxZoomLevel(zoomLevel: Double?) {
        mMaxZoomLevel = zoomLevel
        updateMaxBounds()
    }

    fun setFollowUserLocation(value: Boolean) {
        mFollowUserLocation = value
        updateViewportState()
    }

    private fun updateViewportState() {
        mMapView?.let {
            val map = it
            val viewport = map.viewport
            if (!mFollowUserLocation) {
                viewport.idle()
                mLocationManager?.disable()
                return
            }

            mLocationManager?.let { locManager ->
                val provider = locManager.provider
                map.location.setLocationProvider(provider)
                locManager.enable()
            }

            val location = map.location2
            val followOptions = FollowPuckViewportStateOptions.Builder()
            val cameraState = map.getMapboxMap().cameraState
            when (mFollowUserMode ?: "normal") {
                "compass" -> {
                    location.updateSettings2 {
                        puckBearingEnabled = true
                        puckBearingSource = PuckBearingSource.HEADING
                    }
                    followOptions.bearing(FollowPuckViewportStateBearing.SyncWithLocationPuck)
                }
                "course" -> {
                    location.updateSettings2 {
                        puckBearingEnabled = true
                        puckBearingSource = PuckBearingSource.COURSE
                    }
                    followOptions.bearing(FollowPuckViewportStateBearing.SyncWithLocationPuck)
                }
                "normal" -> {
                    location.updateSettings2 {
                        puckBearingEnabled = false
                    }
                    when (mFollowHeading) {
                        null -> followOptions.bearing(
                            FollowPuckViewportStateBearing.Constant(
                                cameraState.bearing
                            )
                        )
                        else -> followOptions.bearing(
                            FollowPuckViewportStateBearing.Constant(
                                cameraState.bearing
                            )
                        )
                    }
                }
                else -> {
                    Logger.e("RCTMGLCamera", "unexpected follow mode: $mFollowUserMode")
                }
            }
            val cameraOptions = CameraOptions.Builder()
            when (mFollowPitch) {
                null -> {
                    followOptions.pitch(cameraState.pitch)
                    cameraOptions.pitch(cameraState.pitch)
                }
                else -> {
                    followOptions.pitch(mFollowPitch)
                    cameraOptions.pitch(mFollowPitch)
                }
            }
            when (mFollowZoomLevel) {
                null -> {
                    followOptions.zoom(cameraState.zoom)
                    cameraOptions.zoom(cameraState.zoom)
                }
                else -> {
                    followOptions.zoom(mFollowZoomLevel)
                    cameraOptions.zoom(mFollowZoomLevel)
                }
            }
            val followState = viewport.makeFollowPuckViewportState(followOptions.build())
            val defaultTransitionOptions = DefaultViewportTransitionOptions.Builder()
            defaultTransitionOptions.maxDurationMs(mAnimationDuration ?: 0)
            viewport.transitionTo(
                followState,
                viewport.makeDefaultViewportTransition(defaultTransitionOptions.build())
            )
//            mapboxMap?.setCamera(cameraOptions.build())
        }
        mapboxMap?.let {
            it.getStyle()?.let { style ->
                updateLocationLayer(style)
            }
        }
    }

    fun setFollowUserMode(mode: String?) {
        mFollowUserMode = mode
        updateViewportState()
    }

    val mapboxMap: MapboxMap?
        get() = if (mMapView == null) {
            null
        } else mMapView!!.getMapboxMap()

    /**
     * Create a payload of the location data per the web api geolocation spec
     * https://dev.w3.org/geo/api/spec-source.html#position
     *
     * @return
     */
    private fun makeLocationChangePayload(location: Location): WritableMap {
        val positionProperties: WritableMap = WritableNativeMap()
        val coords: WritableMap = WritableNativeMap()
        coords.putDouble("longitude", location.longitude)
        coords.putDouble("latitude", location.latitude)
        coords.putDouble("altitude", location.altitude)
        coords.putDouble("accuracy", location.accuracy.toDouble())
        // A better solution will be to pull the heading from the compass engine, 
        // unfortunately the api is not publicly available in the mapbox sdk
        coords.putDouble("heading", location.bearing.toDouble())
        coords.putDouble("course", location.bearing.toDouble())
        coords.putDouble("speed", location.speed.toDouble())
        positionProperties.putMap("coords", coords)
        positionProperties.putDouble("timestamp", location.time.toDouble())
        return positionProperties
    }
}