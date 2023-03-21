package com.mapbox.rctmgl.modules

import android.os.Build
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.RCTNativeAppEventEmitter
import com.mapbox.bindgen.Expected
import com.mapbox.bindgen.Value
import com.mapbox.common.*
import com.mapbox.geojson.FeatureCollection
import com.mapbox.geojson.Geometry
import com.mapbox.maps.*
import com.mapbox.rctmgl.events.IEvent
import com.mapbox.rctmgl.events.OfflineEvent
import com.mapbox.rctmgl.events.constants.EventTypes
import com.mapbox.turf.TurfMeasurement
import com.mapbox.rctmgl.modules.RCTMGLModule
import com.mapbox.rctmgl.utils.ConvertUtils
import com.mapbox.rctmgl.utils.GeoJSONUtils
import com.mapbox.rctmgl.utils.LatLngBounds
import com.mapbox.rctmgl.utils.Logger
import com.mapbox.turf.TurfMeasurement
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.io.File
import java.io.UnsupportedEncodingException
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
import java.util.*
import java.util.concurrent.CountDownLatch


class TileRegionPack(var name: String, var progress: TileRegionLoadProgress?, var state: String) {
    var cancelable: Cancelable? = null
    var loadOptions: TileRegionLoadOptions? = null

    companion object {
        val ACTIVE = "active"
        val INACTIVE = "inactive"
        val COMPLETE = "complete"
    }
}

@ReactModule(name = RCTMGLOfflineModule.REACT_CLASS)
class RCTMGLOfflineModule(private val mReactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(
        mReactContext
    ) {
    private var offlineManagerLegacy: OfflineRegionManager? = null
    private lateinit var offlineRegionLegacy: OfflineRegion
    var tileRegionPacks = HashMap<String, TileRegionPack>()
    private var mProgressEventThrottle = 300.0
    override fun getName(): String {
        return REACT_CLASS
    }

    private fun getOfflineManagerLegacy(): OfflineRegionManager? {
        if (offlineManagerLegacy == null) {
            Log.d("OFFLINE DOWNLOAD", "Creating offline region manager instance")
            offlineManagerLegacy = OfflineRegionManager(MapInitOptions.getDefaultResourceOptions(mReactContext))
        }
        return offlineManagerLegacy
    }

    @ReactMethod
    fun addListener(eventName: String?) {
        // Set up any upstream listeners or background tasks as necessary
    }

    @ReactMethod
    fun removeListeners(count: Int?) {
        // Remove upstream listeners, stop unnecessary background tasks
    }

    @ReactMethod
    @Throws(JSONException::class)
    fun createPack(options: ReadableMap, promise: Promise) {
        val name = ConvertUtils.getString("name", options, "")
        val offlineManager = getOfflineManager(mReactContext)
        val latLngBounds = getBoundsFromOptions(options)
        val descriptorOptions = TilesetDescriptorOptions.Builder().styleURI(
            (options.getString("styleURL"))!!
        ).minZoom(options.getInt("minZoom").toByte()).maxZoom(options.getInt("maxZoom").toByte())
            .build()
        val tilesetDescriptor = offlineManager.createTilesetDescriptor(descriptorOptions)
        val descriptors = ArrayList<TilesetDescriptor>()
        descriptors.add(tilesetDescriptor)
        val loadOptions = TileRegionLoadOptions.Builder()
            .geometry(GeoJSONUtils.fromLatLngBoundsToPolygon(latLngBounds))
            .descriptors(descriptors)
            .metadata(Value.valueOf((options.getString("metadata"))!!))
            .acceptExpired(true)
            .networkRestriction(NetworkRestriction.NONE)
            .build()
        val metadataStr = options.getString("metadata")
        val metadata = JSONObject(metadataStr)
        val id = metadata.getString("name")
        val pack = TileRegionPack(id, null, TileRegionPack.INACTIVE)
        pack.loadOptions = loadOptions
        tileRegionPacks[id] = pack
        promise.resolve(fromOfflineRegion(latLngBounds, metadataStr))
        startPackDownload(pack)
    }

    @ReactMethod
    @Throws(JSONException::class)
    fun createPackLegacy(options: ReadableMap, promise: Promise) {
        val metadataStr = options.getString("metadata")
        val name = ConvertUtils.getString("name", options, "")
        val manager = getOfflineManagerLegacy()
        val latLngBounds = getBoundsFromOptions(options)
        val definition = OfflineRegionTilePyramidDefinition.Builder()
            .bounds(latLngBounds.toBounds())
            .glyphsRasterizationMode(GlyphsRasterizationMode.IDEOGRAPHS_RASTERIZED_LOCALLY)
            .styleURL((options.getString("styleURL"))!!)
            .minZoom(options.getInt("minZoom").toDouble())
            .maxZoom(options.getInt("maxZoom").toDouble())
            .pixelRatio(mReactContext.resources.displayMetrics.scaledDensity)
            .build()
        promise.resolve(fromOfflineRegion(latLngBounds, metadataStr))
        UiThreadUtil.runOnUiThread(object: Runnable {
            override fun run() {
                manager!!.createOfflineRegion(definition) { expected ->
                    if (expected.isValue) {
                        expected.value?.let {
                            offlineRegionLegacy = it
                            offlineRegionLegacy.setMetadata(getMetadataBytes(metadataStr!!)!!) {
                                if (it.isValue) {
                                    Log.d("Offline", "Metadata added to region")
                                } else {
                                    Log.d("Offline", "Could not set metadata on region")
                                }
                            }
                            offlineRegionLegacy.setOfflineRegionObserver(object : OfflineRegionObserver {
                                var prevStatus: OfflineRegionStatus? = null
                                var timestamp: Long = System.currentTimeMillis()
                                private fun shouldSendUpdate(
                                    currentTimestamp: Long,
                                    curStatus: OfflineRegionStatus
                                ): Boolean {
                                    if (prevStatus?.downloadState != curStatus.downloadState) {
                                        return true
                                    }
                                    if (currentTimestamp - timestamp > mProgressEventThrottle) {
                                        return true
                                    }
                                    return false
                                }
                                override fun mapboxTileCountLimitExceeded(limit: Long) {
                                    val message = String.format(Locale.getDefault(),"Mapbox tile limit exceeded %d", limit)
                                    sendEvent(makeErrorEvent(name, EventTypes.OFFLINE_TILE_LIMIT, message))
                                }
                                override fun statusChanged(status: OfflineRegionStatus) {
                                    val update = shouldSendUpdate(System.currentTimeMillis(), status)
                                    if (update) {
                                        sendEvent(makeStatusEventLegacy(name, status))
                                        timestamp = System.currentTimeMillis()
                                    }
                                    prevStatus = status
                                }
                                override fun responseError(error: ResponseError) {
                                    offlineRegionLegacy.setOfflineRegionDownloadState(
                                        OfflineRegionDownloadState.INACTIVE
                                    )
                                    sendEvent(
                                        makeErrorEvent(
                                            name,
                                            EventTypes.OFFLINE_ERROR,
                                            error.message
                                        )
                                    )
                                }
                            })
                            offlineRegionLegacy.setOfflineRegionDownloadState(OfflineRegionDownloadState.ACTIVE)
                        }
                    } else {
                        sendEvent(
                            makeErrorEvent(name, EventTypes.OFFLINE_ERROR, expected.error!!)
                        )
                    }
                }
            }
        })
    }

    fun startPackDownload(pack: TileRegionPack) {
        val _this = this
        pack.cancelable = getTileStore()
            .loadTileRegion(
                pack.name,
                (pack.loadOptions)!!,
                { progress ->
                    pack.progress = progress
                    pack.state = TileRegionPack.ACTIVE
                    _this.sendEvent(_this.makeStatusEvent(pack.name, progress, pack))
                }
            ) { region ->
                pack.cancelable = null
                if (region.isError) {
                    pack.state = TileRegionPack.INACTIVE
                    _this.sendEvent(
                        _this.makeErrorEvent(
                            pack.name, "TileRegionError", region.error!!
                                .message
                        )
                    )
                } else {
                    pack.state = TileRegionPack.COMPLETE
                    _this.sendEvent(_this.makeStatusEvent(pack.name, pack.progress, pack))
                }
            }
    }

    @ReactMethod
    fun getPacks(promise: Promise) {
        getTileStore().getAllTileRegions(object : TileRegionsCallback {
            override fun run(regions: Expected<TileRegionError, List<TileRegion>>) {
                UiThreadUtil.runOnUiThread(object : Runnable {
                    override fun run() {
                        if (regions.isValue) {
                            convertRegionsToJSON((regions.value)!!, promise)
                        } else {
                            promise.reject("getPacks", regions.error!!.message)
                        }
                    }
                })
            }
        }
    }

    private fun convertLegacyRegionsToJSON(regions: List<OfflineRegion>, promise: Promise) {
        try {
            val result = Arguments.createArray()
            for (region: OfflineRegion in regions) {
                val bounds = region.tilePyramidDefinition!!.bounds
                val metadata = String(region.metadata)
                val map = Arguments.createMap()
                map.putArray("bounds", GeoJSONUtils.fromCoordinateBounds(bounds))
                map.putMap("metadata", convertJsonToMap(JSONObject(metadata)))
                result.pushMap(map)
            }
            promise.resolve(result)
        } catch (interruptedException: InterruptedException) {
            promise.reject(interruptedException)
        }
    }

    private fun convertRegionsToJSON(tileRegions: List<TileRegion>, promise: Promise) {
        val countDownLatch = CountDownLatch(tileRegions.size)
        val errors = ArrayList<TileRegionError?>()
        val geometries = ArrayList<Geometry>()
        try {
            for (region: TileRegion in tileRegions) {
                getTileStore()
                    .getTileRegionGeometry(region.id, object : TileRegionGeometryCallback {
                        override fun run(result: Expected<TileRegionError, Geometry>) {
                            if (result.isValue) {
                                geometries.add(result.value!!)
                            } else {
                                errors.add(result.error)
                            }
                            countDownLatch.countDown()
                        }
                    })
            }
        } catch (error: Error) {
            Logger.e("OS", "a")
        }
        try {
            countDownLatch.await()
            val result = Arguments.createArray()
            for (geometry: Geometry in geometries) {
                result.pushMap(fromOfflineRegion(geometry))
            }
            for (error: TileRegionError? in errors) {
                val errorMap = Arguments.createMap()
                errorMap.putString("type", "error")
                errorMap.putString("message", error!!.message)
                errorMap.putString("errorType", error.type.toString())
                result.pushMap(errorMap)
            }
            promise.resolve(
                result
            )
        } catch (interruptedException: InterruptedException) {
            promise.reject(interruptedException)
        }
    }

    @ReactMethod
    fun resetDatabase(promise: Promise) {
        val tileStore = getTileStore()
        tileStore.getAllTileRegions { expected ->
            expected.value?.also { tileRegions ->
                tileRegions.forEach { tileRegion ->
                    tileStore.removeTileRegion(tileRegion.id);
                }

                val offlineManager = getOfflineManager(mReactContext)
                offlineManager.getAllStylePacks { expected ->
                    expected.value?.also { stylePacks ->
                        stylePacks.forEach { stylePack ->
                            offlineManager.removeStylePack(stylePack.styleURI)
                        }
                        promise.resolve(null)
                    } ?: run {
                        Logger.w(LOG_TAG, "resetDatabase: error: ${expected.error}")
                        promise.reject(Error(expected.error?.message ?: "n/a"))
                    }
                }

                promise.resolve(null);
            }?: run {
                Logger.w(LOG_TAG, "resetDatabase: error: ${expected.error}")
                promise.reject(Error(expected.error?.message ?: "n/a"))
            }
        }

    }

    @ReactMethod
    fun getPackStatus(name: String, promise: Promise) {
        val pack = tileRegionPacks[name]
        if (pack != null) {
            promise.resolve(makeRegionStatus(name, pack.progress, pack))
        } else {
            promise.reject(Error("Pack not found"))
            Logger.w(REACT_CLASS, "getPackStatus - Unknown offline region")
        }
    }

    /*
    @ReactMethod
    public void setPackObserver(final String name, final Promise promise) {
        activateFileSource();

        final OfflineManager offlineManager = OfflineManager.getInstance(mReactContext);

        offlineManager.listOfflineRegions(new OfflineManager.ListOfflineRegionsCallback() {
            @Override
            public void onList(OfflineRegion[] offlineRegions) {
                OfflineRegion region = getRegionByName(name, offlineRegions);
                boolean hasRegion = region != null;

                if (hasRegion) {
                    setOfflineRegionObserver(name, region);
                }

                promise.resolve(hasRegion);
            }

            @Override
            public void onError(String error) {
                promise.reject("setPackObserver", error);
            }
        });
    }*/
    /*
    @ReactMethod
    public void invalidatePack(final String name, final Promise promise) {
        activateFileSource();

        final OfflineManager offlineManager = OfflineManager.getInstance(mReactContext);

        offlineManager.listOfflineRegions(new OfflineManager.ListOfflineRegionsCallback() {
            @Override
            public void onList(OfflineRegion[] offlineRegions) {
                OfflineRegion region = getRegionByName(name, offlineRegions);

                if (region == null) {
                    promise.resolve(null);
                    Log.w(REACT_CLASS, "invalidateRegion - Unknown offline region");
                    return;
                }

                region.invalidate(new OfflineRegion.OfflineRegionInvalidateCallback() {
                    @Override
                    public void onInvalidate() {
                        promise.resolve(null);
                    }

                    @Override
                    public void onError(String error) {
                        promise.reject("invalidateRegion", error);
                    }
                });
            }

            @Override
            public void onError(String error) {
                promise.reject("invalidateRegion", error);
            }
        });
    }*/

    @ReactMethod
    fun deletePack(name: String, promise: Promise) {
        getTileStore().getAllTileRegions{ expected ->
            if (expected.isValue) {
                expected.value?.let { tileRegionList ->
                    var downloadedRegionExists = false
                    for (tileRegion in tileRegionList) {
                        if (tileRegion.id == name) {
                            downloadedRegionExists = true
                            getTileStore()!!.removeTileRegion(name
                            ) { promise.resolve(null) }
                        }
                    }
                    if (!downloadedRegionExists) {
                        promise.resolve(null)
                    }
                }
            }
            expected.error?.let { tileRegionError ->
                promise.reject("deletePack", "TileRegionError: $tileRegionError")
            }
        }
    }


    @ReactMethod
    fun deletePackLegacy(name: String, promise: Promise) {
        UiThreadUtil.runOnUiThread(object: Runnable {
            override fun run() {
                val legacyManger = getOfflineManagerLegacy()
                legacyManger!!.getOfflineRegions { expected ->
                    if (expected.isValue) {
                        expected.value?.let { regions ->
                            var downloadedRegionExists = false
                            for (region in regions) {
                                val regionName = JSONObject(String(region.metadata)).getString("name")
                                if (regionName == name) {
                                    downloadedRegionExists = true
                                    region.purge { promise.resolve(null) }
                                }
                            }
                            if (!downloadedRegionExists) {
                                promise.resolve(null)
                            }
                        }
                    } else {
                        promise.reject("deletePackLegacy", expected.error!!)
                    }
                }
            }
        })
    }

    @ReactMethod
    fun getPacksLegacy(promise: Promise) {
        UiThreadUtil.runOnUiThread(object: Runnable {
            override fun run() {
                try {
                    val legacyManger = getOfflineManagerLegacy()
                    legacyManger!!.getOfflineRegions { regions ->
                        if (regions.isValue) {
                            convertLegacyRegionsToJSON((regions.value)!!, promise)
                        } else {
                            Log.d("OFFLINE DOWNLOAD", "regions is an error")
//                            promise.reject("getPacksLegacy", regions.error!!)
                        }
                    }
                } catch (e: Exception){
                    e.message?.let { Log.d("OFFLINE DOWNLOAD", it) }
                }
            }
        })
    }

    @ReactMethod
    fun migrateOfflineCache() {
        try {
            // Old and new cache file paths
            val targetPathName = mReactContext.filesDir.absolutePath + "/.mapbox/map_data"
            val sourcePath = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                Paths.get(mReactContext.filesDir.absolutePath + "/mbgl-offline.db")
            } else {
                mReactContext.filesDir.absolutePath + "/mbgl-offline.db"
            }
            val targetPath = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                Paths.get("$targetPathName/map_data.db")
            } else {
                "$targetPathName/map_data.db"
            }
            val directory = File(targetPathName)
            if (!directory.exists()) {
                directory.mkdirs()
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    Files.move(sourcePath as Path?, targetPath as Path?, StandardCopyOption.REPLACE_EXISTING)
                } else {
                    File(sourcePath as String?).renameTo(File(targetPath as String?))
                }
                Log.d("TAG","v10 cache directory created successfully")
            }
        } catch (e: Exception) {
            Log.d("TAG", "${e}... file move unsuccessful")
        }
    }

    @ReactMethod
    fun pausePackDownload(name: String, promise: Promise) {
        val pack = tileRegionPacks[name]
        if (pack != null) {
            if (pack.cancelable != null) {
                pack.cancelable!!.cancel()
                pack.cancelable = null
                promise.resolve(null)
            } else {
                promise.reject("resumeRegionDownload", "Offline region cancelled already")
            }
        } else {
            promise.reject("resumeRegionDownload", "Unknown offline region")
        }
    }

    @ReactMethod
    fun resumePackDownload(name: String, promise: Promise) {
        val pack = tileRegionPacks[name]
        if (pack != null) {
            startPackDownload(pack)
            promise.resolve(null)
        } else {
            promise.reject("resumeRegionDownload", "Unknown offline region")
        }
    }

    @ReactMethod
    fun setTileCountLimit(tileCountLimit: Int) {
        val offlineRegionManager = OfflineRegionManager(ResourceOptions.Builder().accessToken(RCTMGLModule.getAccessToken(mReactContext)).build())
        offlineRegionManager.setOfflineMapboxTileCountLimit(tileCountLimit.toLong())
    }

    @ReactMethod
    fun setTileCountLimitLegacy(tileCountLimit: Int) {
        val offlineManagerLegacy = getOfflineManagerLegacy()
        offlineManagerLegacy!!.setOfflineMapboxTileCountLimit(tileCountLimit.toLong())
    }

    @ReactMethod
    fun setProgressEventThrottle(eventThrottle: Double) {
        mProgressEventThrottle = eventThrottle
    }

    private fun getMetadataBytes(metadata: String?): ByteArray? {
        var metadataBytes: ByteArray? = null
        if (metadata == null || metadata.isEmpty()) {
            return metadataBytes
        }
        try {
            metadataBytes = metadata.toByteArray(charset("utf-8"))
        } catch (e: UnsupportedEncodingException) {
            Log.w(REACT_CLASS, e.localizedMessage)
        }
        return metadataBytes
    }

    private fun sendEvent(event: IEvent) {
        val eventEmitter = eventEmitter
        eventEmitter.emit(event.key, event.toJSON())
    }

    private val eventEmitter: RCTNativeAppEventEmitter
        private get() = mReactContext.getJSModule(RCTNativeAppEventEmitter::class.java)

    private fun makeErrorEvent(
        regionName: String,
        errorType: String,
        message: String
    ): OfflineEvent {
        val payload: WritableMap = WritableNativeMap()
        payload.putString("message", message)
        payload.putString("name", regionName)
        return OfflineEvent(OFFLINE_ERROR, errorType, payload)
    }

    private fun makeStatusEvent(
        regionName: String,
        status: TileRegionLoadProgress?,
        pack: TileRegionPack
    ): OfflineEvent {
        return OfflineEvent(
            OFFLINE_PROGRESS,
            EventTypes.OFFLINE_STATUS,
            makeRegionStatus(regionName, status, pack)
        )
    }

    private fun makeStatusEventLegacy(
        regionName: String,
        status: OfflineRegionStatus
    ): OfflineEvent {
        return OfflineEvent(
            OFFLINE_PROGRESS,
            EventTypes.OFFLINE_STATUS,
            makeRegionStatusLegacy(regionName, status)
        )
    }

    private fun makeRegionStatus(
        regionName: String,
        status: TileRegionLoadProgress?,
        pack: TileRegionPack
    ): WritableMap {
        val map = Arguments.createMap()
        val progressPercentage =
            (status!!.completedResourceCount.toDouble() * 100.0) / (status.requiredResourceCount.toDouble())
        map.putString("name", regionName)
        map.putString("state", pack.state)
        map.putDouble("percentage", progressPercentage)
        map.putInt("completedResourceCount", status.completedResourceCount.toInt())
        map.putInt("completedResourceSize", status.completedResourceSize.toInt())
        map.putInt("erroredResourceCount", status.erroredResourceCount.toInt())
        map.putInt("requiredResourceCount", status.requiredResourceCount.toInt())
        map.putInt("loadedResourceCount", status.loadedResourceCount.toInt())
        map.putInt("loadedResourceSize", status.loadedResourceSize.toInt())
        return map
    }

    private fun makeRegionStatusLegacy(
        regionName: String,
        status: OfflineRegionStatus
    ): WritableMap {
        val map = Arguments.createMap()
        val offlineDownloadState = status.downloadState
        var downloadState = 0
        val progressPercentage =
            (status.completedResourceCount.toDouble() * 100.0) / (status.requiredResourceCount.toDouble())
        if (progressPercentage == 100.0) {
            downloadState = 0
        } else if (offlineDownloadState == OfflineRegionDownloadState.ACTIVE) {
            downloadState = 1
        }
        map.putString("name", regionName)
        map.putInt("state", downloadState)
        map.putDouble("percentage", progressPercentage)
        map.putInt("completedResourceCount", status.completedResourceCount.toInt())
        map.putInt("completedResourceSize", status.completedResourceSize.toInt())
        map.putInt("completedTileCount", status.completedTileCount.toInt())
        map.putInt("completedTileSize", status.completedTileSize.toInt())
        map.putInt("requiredResourceCount", status.requiredResourceCount.toInt())
        Log.d("OFFLINE DOWNLOAD", map.toString())
        return map
    }

    private fun getBoundsFromOptions(options: ReadableMap): LatLngBounds {
        val featureCollectionJSONStr = ConvertUtils.getString("bounds", options, "{}")
        val featureCollection = FeatureCollection.fromJson(featureCollectionJSONStr)
        return GeoJSONUtils.toLatLngBounds(featureCollection)
    }

    private fun fromOfflineRegion(bounds: LatLngBounds, metadataStr: String?): WritableMap {
        val map = Arguments.createMap()
        map.putArray("bounds", GeoJSONUtils.fromLatLngBounds(bounds))
        map.putString("metadata", metadataStr)
        return map
    }

    private fun fromOfflineRegion(region: Geometry): WritableMap {
        val map = Arguments.createMap()
        val bbox = TurfMeasurement.bbox(region)
        val bounds = Arguments.createArray()
        for (d: Double in bbox) {
            bounds.pushDouble(d)
        }
        map.putArray("bounds", bounds)
        map.putMap("geometry", GeoJSONUtils.fromGeometry(region))

        //map.putString("metadata", new String(region.getMetadata()));
        return map
    }

    @Throws(JSONException::class)
    private fun convertJsonToMap(jsonObject: JSONObject): WritableMap? {
        val map: WritableMap = WritableNativeMap()
        val iterator = jsonObject.keys()
        while (iterator.hasNext()) {
            val key = iterator.next()
            val value = jsonObject[key]
            if (value is JSONObject) {
                map.putMap(key, convertJsonToMap(value))
            } else if (value is JSONArray) {
                map.putArray(key, convertJsonToArray(value))
            } else if (value is Boolean) {
                map.putBoolean(key, value)
            } else if (value is Int) {
                map.putInt(key, value)
            } else if (value is Double) {
                map.putDouble(key, value)
            } else if (value is String) {
                map.putString(key, value)
            } else {
                map.putString(key, value.toString())
            }
        }
        return map
    }

    @Throws(JSONException::class)
    private fun convertJsonToArray(jsonArray: JSONArray): WritableArray? {
        val array: WritableArray = WritableNativeArray()
        for (i in 0 until jsonArray.length()) {
            val value = jsonArray[i]
            if (value is JSONObject) {
                array.pushMap(convertJsonToMap(value))
            } else if (value is JSONArray) {
                array.pushArray(convertJsonToArray(value))
            } else if (value is Boolean) {
                array.pushBoolean(value)
            } else if (value is Int) {
                array.pushInt(value)
            } else if (value is Double) {
                array.pushDouble(value)
            } else if (value is String) {
                array.pushString(value)
            } else {
                array.pushString(value.toString())
            }
        }
        return array
    }

    /*
    private OfflineRegion getRegionByName(String name, OfflineRegion[] offlineRegions) {
        if (name == null || name.isEmpty()) {
            return null;
        }

        for (OfflineRegion region : offlineRegions) {
            boolean isRegion = false;

            try {
                byte[] byteMetadata = region.getMetadata();

                if (byteMetadata != null) {
                    JSONObject metadata = new JSONObject(new String(byteMetadata));
                    isRegion = name.equals(metadata.getString("name"));
                }
            } catch (JSONException e) {
                Log.w(REACT_CLASS, e.getLocalizedMessage());
            }

            if (isRegion) {
                return region;
            }
        }

        return null;
    }*/

    /*
    private void activateFileSource() {
        FileSource fileSource = FileSource.getInstance(mReactContext);
        fileSource.activate();
    }*/
    companion object {
        const val REACT_CLASS = "RCTMGLOfflineModule"
        const val LOG_TAG = REACT_CLASS
        @JvmField
        val INACTIVE_REGION_DOWNLOAD_STATE = TileRegionPack.INACTIVE
        @JvmField
        val ACTIVE_REGION_DOWNLOAD_STATE = TileRegionPack.ACTIVE
        @JvmField
        val COMPLETE_REGION_DOWNLOAD_STATE = TileRegionPack.COMPLETE
        @JvmField
        val OFFLINE_ERROR = "MapboxOfflineRegionError"
        @JvmField
        val OFFLINE_PROGRESS = "MapboxOfflineRegionProgress"

        //    public static final String DEFAULT_STYLE_URL = Style.MAPBOX_STREETS;
        val DEFAULT_MIN_ZOOM_LEVEL = 10.0
        val DEFAULT_MAX_ZOOM_LEVEL = 20.0
        var offlineManager: OfflineManager? = null
        var _tileStore: TileStore? = null
        fun getOfflineManager(mReactContext: ReactApplicationContext?): OfflineManager {
            val manager = offlineManager
            if (manager == null) {
                val result = OfflineManager(
                    ResourceOptions.Builder()
                        .accessToken(RCTMGLModule.getAccessToken(mReactContext)).tileStore(
                        getTileStore()
                    ).build()
                )
                offlineManager = result
                return result
            } else {
                return manager
            }
        }

        fun getTileStore(): TileStore {
            val store = _tileStore
            if (store == null) {
                val result = TileStore.create()
                _tileStore = result
                return result
            }
            return store
        }
    }
}