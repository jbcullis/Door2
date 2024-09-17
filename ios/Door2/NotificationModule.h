#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTComponent.h>
#import <React/RCTEventEmitter.h>

@interface NotificationModule : RCTEventEmitter <RCTBridgeModule>
+ (id)allocWithZone:(NSZone *)zone;
- (void)onDeviceToken:(NSData *)deviceToken;
- (void)onDeepLink:(NSString *)deepLink;
@end
