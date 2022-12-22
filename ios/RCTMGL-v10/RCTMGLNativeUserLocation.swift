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
      if visible {
        configurePuck()
      }
    }
  }
  @objc var nativeShadowImage : NSDictionary? = nil {
    didSet {
      if visible {
        configurePuck()
      }
    }
  }
  @objc var nativeTopImage : NSDictionary? = nil {
    didSet {
      if visible {
        configurePuck()
      }
    }
  }
  
  func configurePuck() {
    if let map = self.map {
      print("nativeTopImage: \(String(describing: nativeTopImage))")
      if (nativeBearingImage != nil || nativeShadowImage != nil || nativeTopImage != nil) {
        let bearingImage = nativeBearingImage != nil ? RCTConvert.uiImage(nativeBearingImage) : nil
        let shadowImage = nativeShadowImage != nil ? RCTConvert.uiImage(nativeShadowImage) : nil
        let topImage = nativeTopImage != nil ? RCTConvert.uiImage(nativeTopImage) : nil
        map.location.options.puckType = .puck2D(.init(topImage: topImage, bearingImage: bearingImage, shadowImage: shadowImage, scale: nil, pulsing: nil, showsAccuracyRing: true, opacity: 1.0))
      } else {
        map.location.options.puckType = .puck2D(.makeDefault(showBearing: iosShowsUserHeadingIndicator))
      }
    }
  }

  @objc
  var iosShowsUserHeadingIndicator : Bool = false {
    didSet {
      if visible {
        configurePuck()
      }
    }
  }

  func addToMap(_ map: RCTMGLMapView, style: Style) {
    self.map = map
    visible = true
    configurePuck()
  }

  func removeFromMap(_ map: RCTMGLMapView) {
    guard let mapboxMap = map.mapboxMap else {
      return
    }
    visible = false
    _ = mapboxMap.style
    map.location.options.puckType = .none
  }
  
  func waitForStyleLoad() -> Bool {
    return true
  }
}
