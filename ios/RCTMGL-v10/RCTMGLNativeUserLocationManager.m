#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(RCTMGLNativeUserLocationManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(iosShowsUserHeadingIndicator, BOOL);
RCT_EXPORT_VIEW_PROPERTY(nativeBearingImage, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(nativeShadowImage, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(nativeTopImage, NSDictionary);

@end

