import MapboxMaps
import React

@objc
class RCTMGLNativeUserLocation : UIView, RCTMGLMapComponent {
  let locationLayerId = "location-layer"
  var locationLayer : LocationIndicatorLayer? = nil
  weak var map : RCTMGLMapView! = nil
  var visible : Bool = false
  
  @objc var nativeBearingImage : NSDictionary? = nil {
    didSet {
      if let map = self.map { _applySettings(map) }
    }
  }
  @objc var nativeShadowImage : NSDictionary? = nil {
    didSet {
      if let map = self.map { _applySettings(map) }
    }
  }
  @objc var nativeTopImage : NSDictionary? = nil {
    didSet {
      if let map = self.map { _applySettings(map) }
    }
  }

  @objc
  var iosShowsUserHeadingIndicator : Bool = false {
    didSet {
      if let map = self.map { _applySettings(map) }
    }
  }
  
  func _applySettings(_ map: RCTMGLMapView) {
    if (nativeBearingImage != nil || nativeShadowImage != nil || nativeTopImage != nil) {
        let bearingImage = nativeBearingImage != nil ? RCTConvert.uiImage(nativeBearingImage) : nil
        let shadowImage = nativeShadowImage != nil ? RCTConvert.uiImage(nativeShadowImage) : nil
        let topImage = nativeTopImage != nil ? RCTConvert.uiImage(nativeTopImage) : nil
        map.location.options.puckType = .puck2D(.init(topImage: topImage, bearingImage: bearingImage, shadowImage: shadowImage, scale: nil, pulsing: nil, showsAccuracyRing: true, opacity: 1.0))
      } else {
        map.location.options.puckType = .puck2D(.makeDefault(showBearing: iosShowsUserHeadingIndicator))
      }
    if (iosShowsUserHeadingIndicator) {
      map.location.options.puckBearingSource = .heading
      map.location.options.puckBearingEnabled = true
    } else {
      map.location.options.puckBearingEnabled = false
    }
  }

  func addToMap(_ map: RCTMGLMapView, style: Style) {
    self.map = map
    _applySettings(map)
  }

  func removeFromMap(_ map: RCTMGLMapView) {
    map.location.options.puckType = nil
    guard let mapboxMap = map.mapboxMap else {
      return
    }
    let style = mapboxMap.style
    map.location.options.puckType = .none
    self.map = nil
  }
  
  func waitForStyleLoad() -> Bool {
    return true
  }
}
