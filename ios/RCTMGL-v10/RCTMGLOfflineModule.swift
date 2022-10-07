import Foundation
import MapboxMaps
import UIKit

extension Date {
  func toJSONString() -> String {
    let dateFormatter = DateFormatter()
    let enUSPosixLocale = Locale(identifier: "en_US_POSIX")
    dateFormatter.locale = enUSPosixLocale
    dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ssZZZZZ"
    return dateFormatter.string(from: self as Date)
  }
}

@objc(RCTMGLOfflineModule)
class RCTMGLOfflineModule: RCTEventEmitter {
  var hasListeners = false
  var legacyPackTimestamp : Double = 0.0
  var legacyPackState : Int = -1
  var progressEventThrottle : Double = 500
  
  enum Callbacks : String {
    case error = "MapboOfflineRegionError"
    case progress = "MapboxOfflineRegionProgress"
  }
  
  enum State : String {
    case invalid
    case inactive
    case active
    case complete
    case unknown
  }
  
  lazy var offlineManager : OfflineManager = {
    return OfflineManager(resourceOptions: .init(accessToken: MGLModule.accessToken!))
  }()
  
  lazy var offlineManagerLegacy : OfflineRegionManager = {
    return OfflineRegionManager(resourceOptions: ResourceOptionsManager.default.resourceOptions)
  }()
  var offlineRegionLegacy: OfflineRegion!
  
  lazy var tileStore : TileStore = {
    return TileStore.default
  }()
  
  struct TileRegionPack {
    var name: String
    var cancelable: Cancelable? = nil
    var progress : TileRegionLoadProgress? = nil
    var state : State = .inactive
    var metadata : [String:Any]? = nil
  }
  
  lazy var tileRegionPacks : [String: TileRegionPack] = [:]
  
  
  @objc override
  func startObserving() {
    super.startObserving()
    hasListeners = true
  }
  
  @objc override
  func stopObserving() {
    super.stopObserving()
    hasListeners = false
  }
  
  @objc
  override
  static func requiresMainQueueSetup() -> Bool {
      return true
  }
  
  @objc
  override
  func constantsToExport() -> [AnyHashable: Any]! {
    return [:]
  }
  
  
  @objc
  override
  func supportedEvents() -> [String] {
    return [Callbacks.error.rawValue, Callbacks.progress.rawValue]
  }
  
  func convertRegionToJSON(region: TileRegion, geometry: Geometry, metadata: [String:Any]?) -> [String:Any] {
    let bb = RCTMGLFeatureUtils.boundingBox(geometry: geometry)
    
    var result : [String:Any] = [:]
    if let bb = bb {
      let jsonBounds = [
        bb.northEast.longitude, bb.northEast.latitude,
        bb.southWest.longitude, bb.southWest.latitude
      ]
      
      let completed = (region.completedResourceCount == region.requiredResourceCount)
      
      result["requiredResourceCount"] = region.requiredResourceCount
      result["completedResourceCount"] = region.completedResourceCount
      result["completedResourceSize"] = region.completedResourceSize
      result["state"] = completed ? State.complete.rawValue : State.unknown.rawValue

      var metadata : [String:Any] = metadata ?? [:]
      metadata["name"] = region.id
      
      if region.requiredResourceCount > 0 {
        let percentage = Float(100.0) * Float(region.completedResourceCount) / Float(region.requiredResourceCount)
        result["percentage"] = percentage
      } else {
        result["percentage"] = nil
      }
      if let expires = region.expires {
        result["expires"] = expires.toJSONString()
      }
      
      result["metadata"] = String(data:try! JSONSerialization.data(withJSONObject: metadata, options: [.prettyPrinted]), encoding: .utf8)
      
      result["bounds"] = jsonBounds
    }
    return result
  }
  
  func toProgress(region: TileRegion) -> TileRegionLoadProgress? {
    return TileRegionLoadProgress(completedResourceCount: region.completedResourceCount, completedResourceSize: region.completedResourceSize, erroredResourceCount: 0, requiredResourceCount: region.requiredResourceCount, loadedResourceCount: 0, loadedResourceSize: 0)
  }
  
  func convertRegionToJson(regions: [TileRegion], resolve: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    let taskGroup = DispatchGroup()
    
    var geomteryResults : [String: (Result<Geometry,Error>,TileRegion)] = [:]
    var metadataResults : [String: Result<Any,Error>] = [:]
    
    for region in regions {
      taskGroup.enter()
      taskGroup.enter()
      tileStore.tileRegionGeometry(forId: region.id) { (result) in
        geomteryResults[region.id] = (result, region)
        taskGroup.leave()
      }
      
      tileStore.tileRegionMetadata(forId: region.id) { (result) in
        metadataResults[region.id] = result
        taskGroup.leave()
      }
    }
    
    taskGroup.notify(queue: .main) {
      let firstError = geomteryResults.first { (key,result_and_region) in
        switch result_and_region.0 {
        case .failure:
          return true
        case .success:
          return false
        }
      }
  
      if let firstError = firstError {
        switch firstError.value.0 {
        case .failure(let error):
          rejecter("Error", error.localizedDescription, error)
          return
        case .success:
          fatalError("Expected failure but was success")
        }
      }

      let results = geomteryResults.map { (id, result) -> (String, (Geometry,TileRegion, [String:Any]?)) in
        switch result.0 {
        case .failure(_):
          fatalError("Expected failuer but was success")
        case .success(let geometry):
          return (id, (geometry,result.1,(try? metadataResults[id]?.get()) as? [String:Any]))
        }
      }
      
      resolve(results.map { (id, geometry_region_metadata) -> [String:Any] in
        let (geometry, region, metadata) = geometry_region_metadata
        let ret = self.convertRegionToJSON(region: region, geometry: geometry, metadata: metadata)
        var pack = self.tileRegionPacks[region.id] ?? TileRegionPack(
          name: region.id,
          progress: self.toProgress(region: region),
          state: .unknown,
          metadata: metadata
        )

        if ((region.completedResourceCount == region.completedResourceSize)) {
          pack.state = .complete
        }

        self.tileRegionPacks[region.id] = pack

        return ret
      })
    }
  }
  
  @objc
  func getPacks(_ resolve : @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      self.tileStore.allTileRegions { result in
        switch result {
        case .success(let regions):
          self.convertRegionToJson(regions: regions, resolve: resolve, rejecter: rejecter)
          // self.convertRegionToJson(regions: regions, resolve: resolve)
          // resolve(self.convertRegionToJson(regions: regions))
        case .failure(let error):
          rejecter("TileStoreError", error.localizedDescription, error)
        }
      }
      
/*
      self.offlineManager.allStylePacks { (result) in
        switch result {
        case .success(let packs):
          resolve(self.convertPacksToJson(packs: packs))
        case .failure(let error):
          rejecter(error.localizedDescription, error.localizedDescription, error)
        }
      }*/
    }
    
    
    
//    dispatch_async(dispatch_get_main_queue(), ^{
      /*
            NSArray<MGLOfflinePack *> *packs = [[MGLOfflineStorage sharedOfflineStorage] packs];
            
            if (packs == nil) {
                // packs have not loaded yet
                [self->packRequestQueue addObject:resolve];
                return;
            }

            resolve([self _convertPacksToJson:packs]);
        });*/
  }
  
  
  func convertPointPairToBounds(_ bounds: Geometry) -> Geometry {
    guard case .geometryCollection(let gc) = bounds else {
      return bounds
    }
    let geometries = gc.geometries
    guard geometries.count == 2 else {
      return bounds
    }
    guard case .point(let g0) = geometries[0] else {
      return bounds
    }
    guard case .point(let g1) = geometries[1] else {
      return bounds
    }
    let pt0 = g0.coordinates
    let pt1 = g1.coordinates
    return .polygon(Polygon([
      [
      pt0,
      CLLocationCoordinate2D(latitude: pt0.latitude, longitude: pt1.longitude),
      pt1,
      CLLocationCoordinate2D(latitude: pt1.latitude, longitude: pt0.longitude)
      ]
    ]))
  }
  
  func _sendEvent(_ name:String, event: RCTMGLEvent) {
    if !hasListeners {
      return
    }
    self.sendEvent(withName: name, body: event.toJSON())
  }

  func _makeRegionStatusPayload(_ name:String, progress: TileRegionLoadProgress?, state: State, metadata:[String:Any]?) -> [String:Any?] {
    var result : [String:Any?] = [:]
    if let progress = progress {
      let progressPercentage =  Float(progress.completedResourceCount) / Float(progress.requiredResourceCount)
      
      result = [
        "state": (progress.completedResourceCount == progress.requiredResourceCount) ? State.complete.rawValue : state.rawValue,
        "name": name,
        "percentage": progressPercentage * 100.0,
        "completedResourceCount": progress.completedResourceCount,
        "completedResourceSize": progress.completedResourceSize,
        "erroredResourceCount": progress.erroredResourceCount,
        "loadedResourceSize": progress.loadedResourceSize,
        "loadedResourceCount": progress.loadedResourceCount,
        "requiredResourceCount": progress.requiredResourceCount
      ]
    } else {
      result = [
        "state": state.rawValue,
        "name": name,
        "percentage": nil
      ]
    }
    if let metadata = metadata {
      result["metadata"] = metadata
    }
    return result
  }
  
  func _makeRegionStatusPayload(pack: TileRegionPack) -> [String:Any?] {
    return _makeRegionStatusPayload(pack.name, progress: pack.progress, state: pack.state, metadata: pack.metadata)
  }
  
  func _makeRegionStatusPayloadLegacy(pack: TileRegionPack) -> [String:Any?] {
    return _makeRegionStatusPayload(pack.name, progress: pack.progress, state: pack.state, metadata: pack.metadata)
  }
  
  func makeProgressEvent(_ name: String, progress: TileRegionLoadProgress, state: State) -> RCTMGLEvent {
    RCTMGLEvent(type: .offlineProgress, payload: self._makeRegionStatusPayload(name, progress: progress, state: state, metadata: nil))
  }
  
  func makeProgressEventLegacy(_ name: String, status: OfflineRegionStatus) -> RCTMGLEvent {
    let progressPercentage = status.requiredResourceCount == 0 ? 0 : Float(status.completedResourceCount) / Float(status.requiredResourceCount)
    var payload: Dictionary<String, Any> = [:]
    payload["state"] = status.downloadState.rawValue
    payload["name"] = name
    payload["percentage"] = progressPercentage * 100.0
    payload["completedResourceCount"] = status.completedResourceCount
    payload["completedResourceSize"] = status.completedResourceSize
    payload["completedTileSize"] = status.completedTileSize
    payload["completedTileCount"] = status.completedTileCount
    payload["requiredResourceCount"] = status.requiredResourceCount
    return RCTMGLEvent(type: .offlineProgress, payload: payload)
  }
  
  func shouldSendProgressEvent() -> Bool {
    return true
  }
  
  func shouldSendProgressEventLegacy(currentState : Int) -> Bool {
    if (self.legacyPackState == -1) {
            return true;
        }
        
        if (self.legacyPackState != currentState) {
            return true;
        }
        
    if ((CACurrentMediaTime() * 1000) - self.legacyPackTimestamp > self.progressEventThrottle) {
            return true;
        }
        
        return false;
  }
  
  func offlinePackProgressDidChange(progress: TileRegionLoadProgress, metadata: [String:Any], state: State) {
    if self.shouldSendProgressEvent() {
      let event = makeProgressEvent(metadata["name"] as! String, progress: progress, state: state)
      self._sendEvent(Callbacks.progress.rawValue, event: event)
    }
  }
  
  func offlinePackDidReceiveError(name: String, error: Error) {
    let event = RCTMGLEvent(type: .offlineError, payload: ["name": name, "message": error.localizedDescription])
    self._sendEvent(Callbacks.error.rawValue, event: event)
  }
  
  @objc
  func createPack(_ options: NSDictionary, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      do {
        let metadataStr = options["metadata"] as! String
        let metadata = try JSONSerialization.jsonObject(with: metadataStr.data(using: .utf8)!, options: []) as! [String:Any]
        let id = metadata["name"] as! String
        let stylePackLoadOptions = StylePackLoadOptions(glyphsRasterizationMode: .ideographsRasterizedLocally, metadata: metadata)

        let boundsStr = options["bounds"] as! String
        let boundsData = boundsStr.data(using: .utf8)
        let boundsFC = try JSONDecoder().decode(FeatureCollection.self, from: boundsData!)

        let bounds = self.convertPointPairToBounds(RCTMGLFeatureUtils.fcToGeomtry(boundsFC))

        let descriptorOptions = TilesetDescriptorOptions(
          styleURI: StyleURI(rawValue: options["styleURL"] as! String)!,
          zoomRange: (options["minZoom"] as! NSNumber).uint8Value...(options["maxZoom"] as! NSNumber).uint8Value,
          stylePackOptions: stylePackLoadOptions
        )
        let tilesetDescriptor = self.offlineManager.createTilesetDescriptor(for: descriptorOptions)

        let loadOptions = TileRegionLoadOptions(
          geometry: bounds, // RCTMGLFeatureUtils.geometryToGeometry(bounds),
          descriptors: [tilesetDescriptor],
          metadata: metadata,
          acceptExpired: true,
          networkRestriction: .none,
          averageBytesPerSecond: nil)

        let actPack = RCTMGLOfflineModule.TileRegionPack(
          name: id,
          progress: nil,
          state: .inactive
        )
        self.tileRegionPacks[id] = actPack

        var lastProgress : TileRegionLoadProgress? = nil
        let task = self.tileStore.loadTileRegion(forId: id, loadOptions: loadOptions!, progress: {
          progress in
          lastProgress = progress
          self.tileRegionPacks[id]!.progress = progress
          self.tileRegionPacks[id]!.state = .active
          self.offlinePackProgressDidChange(progress: progress, metadata: metadata, state: .active)
        }) { result in
          switch result {
          case .success(_):
            if let progess = lastProgress {
              self.offlinePackProgressDidChange(progress: progess, metadata: metadata, state: .complete)
            }
            self.tileRegionPacks[id]!.state = .complete
          case .failure(let error):
            self.tileRegionPacks[id]!.state = .inactive
            self.offlinePackDidReceiveError(name: id, error: error)
          }
        }

        self.tileRegionPacks[id]!.cancelable = task
        resolver([
          "bounds": boundsStr,
          "metadata": String(data:try! JSONSerialization.data(withJSONObject: metadata, options: [.prettyPrinted]), encoding: .utf8)
        ])
      } catch {
        rejecter("createPack", error.localizedDescription, error)
      }
    }
  }
  
  func offlinePackProgressDidChangeLegacy(name: String, status: OfflineRegionStatus) {
    if self.shouldSendProgressEventLegacy(currentState: status.downloadState.rawValue) {
      let event = makeProgressEventLegacy(name, status: status )
      self._sendEvent(Callbacks.progress.rawValue, event: event)
      self.legacyPackState = status.downloadState.rawValue
      self.legacyPackTimestamp = CACurrentMediaTime() * 1000
    }
  }
  
  func offlinePackDidReceiveErrorLegacy(name: String, error: ResponseError) {
    let event = RCTMGLEvent(type: .offlineError, payload: ["name": name, "message": error.message])
    self._sendEvent(Callbacks.error.rawValue, event: event)
  }
  
  func offlinePackDidExceedTileLimitLegacy(name: String, limit: UInt64) {
    let event = RCTMGLEvent(type: .offlineTileLimit, payload: ["name": name, "message": "Exceeded the Mapbox tile limit of \(limit)."])
    self._sendEvent(Callbacks.error.rawValue, event: event)
  }
  
  @objc
  func createPackLegacy(_ options: NSDictionary, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
      do {
        let metadataStr = options["metadata"] as! String
        let metadata = try JSONSerialization.jsonObject(with: metadataStr.data(using: .utf8)!, options: []) as! [String:Any]
        let id = metadata["name"] as! String
        let boundsStr = options["bounds"] as! String
        let boundsData = boundsStr.data(using: .utf8)
        let boundsFC = try JSONDecoder().decode(FeatureCollection.self, from: boundsData!)
        var geometry = RCTMGLFeatureUtils.fcToGeomtry(boundsFC)
        guard case .geometryCollection(let gc) = geometry else {
          return
        }
        let geometries = gc.geometries
        guard geometries.count == 2 else {
          return
        }
        guard case .point(let g0) = geometries[0] else {
          return
        }
        guard case .point(let g1) = geometries[1] else {
          return
        }
        let regionOptions = OfflineRegionTilePyramidDefinition(
          styleURL: options["styleURL"] as! String,
          bounds: CoordinateBounds(southwest: g1.coordinates, northeast: g0.coordinates, infiniteBounds: false),
          minZoom: options["minZoom"] as! Double,
          maxZoom: options["maxZoom"] as! Double,
          pixelRatio: Float(UIScreen.main.scale),
          glyphsRasterizationMode: .ideographsRasterizedLocally
        )
        DispatchQueue.main.async {
          self.offlineManagerLegacy.createOfflineRegion(for: regionOptions) { result in
            let region = try? result.get()
            self.offlineRegionLegacy = region
            self.offlineRegionLegacy.setMetadata(metadataStr.data(using: .utf8)!) { result in }
            self.offlineRegionLegacy.setOfflineRegionObserverFor(RegionObserver(name: id, offlineModule: self))
            self.offlineRegionLegacy.setOfflineRegionDownloadStateFor(.active)
          }
          resolver([
            "bounds": boundsStr,
            "metadata": String(data:try! JSONSerialization.data(withJSONObject: metadata, options: [.prettyPrinted]), encoding: .utf8)
          ])
        }
      } catch {
        print("error", error)
        rejecter("createPack", error.localizedDescription, error)
      }
  }
  
  func _getPack(fromName: String) -> TileRegionPack? {
    return self.tileRegionPacks[fromName]
  }
  
  @objc
  func getPackStatus(_ name: String,
                     resolver: @escaping RCTPromiseResolveBlock,
                     rejecter: @escaping RCTPromiseRejectBlock) {
    guard let pack = self._getPack(fromName: name) else {
      resolver(nil)
      return
    }
    
    tileStore.tileRegionMetadata(forId: name) { result in
      switch result {
      case .failure(let error):
        Logger.log(level:.error, message: "Unable to fetch metadata for \(name)")
        rejecter("RCTMGLOfflineModule.getPackStatus", error.localizedDescription, error)
      case .success(let metadata):
        var pack = self.tileRegionPacks[name] ?? TileRegionPack(name: name)
        if let metadata = metadata as? [String:Any] {
          pack.metadata = metadata
        } else {
          Logger.log(level:.error, message: "Unexpected metadata format for \(name) \(metadata)")
        }
        self.tileRegionPacks[name] = pack
        resolver(self._makeRegionStatusPayload(pack: pack))
      }
    }
  }

  
  @objc
  func resumePackDownload(_ name: String, resolver: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock)
  {
    //V10todo start download again
  }
  
  @objc
  func pausePackDownload(_ name: String, resolver: RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock)
  {
    if let pack = _getPack(fromName: name) {
      pack.cancelable?.cancel()
      resolver(nil)
    } else {
      rejecter("pausePackDownload", "Unknown offline region: \(name)", nil)
    }
  }
  
  @objc
  func setTileCountLimit(_ limit: NSNumber) {
    //v10todo
  }
  
  @objc
  func setTileCountLimitLegacy(_ limit: NSNumber) {
    self.offlineManagerLegacy.setOfflineMapboxTileCountLimitForLimit(limit.uint64Value)
  }
  
  @objc
  func setProgressEventThrottle(_ throttleValue: NSNumber) {
    self.progressEventThrottle = Double(truncating: throttleValue)
  }
  
  @objc
  func deletePack(_ name: String,
                  resolver: RCTPromiseResolveBlock,
                  rejecter: RCTPromiseRejectBlock)
  {
    guard let pack = _getPack(fromName: name) else {
      return resolver(nil)
    }
    
    guard pack.state != .invalid else {
      let error = NSError(domain:"RCTMGLErororDomain", code: 1, userInfo: [NSLocalizedDescriptionKey: "Pack has already beend deleted"])
      return rejecter("deletePack", error.description, error)
    }
    
    self.tileStore.removeTileRegion(forId: name)
    self.tileRegionPacks[name]!.state = .invalid
    resolver(nil)
  }

  @objc
  func migrateOfflineCache(_ resolve : @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    // Old and new cache file paths
    let srcURL = URL(fileURLWithPath: NSHomeDirectory()).appendingPathComponent("/Library/Application Support/com.mapbox.examples/.mapbox/cache.db")

    let destURL = URL(fileURLWithPath: NSHomeDirectory()).appendingPathComponent("/Library/Application Support/.mapbox/map_data/map_data.db")

    let fileManager = FileManager.default

    do {
      try fileManager.createDirectory(at: destURL.deletingLastPathComponent(), withIntermediateDirectories: true, attributes: nil)
      try fileManager.moveItem(at: srcURL, to: destURL)
      resolve(nil)
    } catch {
      reject("migrateOfflineCache", error.localizedDescription, error)
    }
  }
  
  @objc
  func getPacksLegacy(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock)
  {
    DispatchQueue.main.async {
      self.offlineManagerLegacy.offlineRegions { result in
        switch result {
        case .success(let regions):
            resolve(regions.map { (region) -> [String:Any] in
              var ret : [String : Any] = [:]
              let metadata = region.getMetadata()
              let bounds = region.getTilePyramidDefinition()?.bounds
              ret["bounds"] = bounds?.toArray()
              do {
                ret["metadata"] = try JSONSerialization.jsonObject(with: region.getMetadata(), options: []) as! [String:Any]
              } catch {
                ret["metadata"] = [:]
              }
              return ret
            })
        case .failure(let error):
          reject("getPacksLegacy", error.localizedDescription, error)
        }
      }
    }
  }
  
  @objc
  func deletePackLegacy(_ name: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock)
  {
    DispatchQueue.main.async {
        self.offlineManagerLegacy.offlineRegions { result in
          switch result {
          case .success(let regions):
            do {
              for region in regions {
                let metadata = try JSONSerialization.jsonObject(with: region.getMetadata(), options: []) as! [String:Any]
                if (metadata["name"] as! String == name) {
                  region.purge { expected in }
                }
              }
              resolve(nil)
            } catch {
              reject("deletePackLegacy", error.localizedDescription, error)
            }
          case .failure(let error):
            reject("deletePackLegacy", error.localizedDescription, error)
          }
        }
    }
  }
}

@available(*, deprecated)
final class RegionObserver : OfflineRegionObserver {
  weak var offlineModule : RCTMGLOfflineModule? = nil
  var packName : String = ""
  
  init(name: String, offlineModule: RCTMGLOfflineModule) {
    self.offlineModule = offlineModule
    self.packName = name
    
  }
  
  func statusChanged(for status: OfflineRegionStatus) {
    offlineModule?.offlinePackProgressDidChangeLegacy(name: packName, status: status)
  }
  
  func responseError(forError error: ResponseError) {
    print("error \(error)")
    offlineModule?.offlinePackDidReceiveErrorLegacy(name: packName, error: error)
  }
  
  func mapboxTileCountLimitExceeded(forLimit limit: UInt64) {
    offlineModule?.offlinePackDidExceedTileLimitLegacy(name: packName, limit: limit)
  }
}
