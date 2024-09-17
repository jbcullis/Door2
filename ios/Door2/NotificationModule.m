#import "NotificationModule.h"
#import "UIKit/UIKit.h"
#import <UserNotifications/UNUserNotificationCenter.h>

@implementation NotificationModule

RCT_EXPORT_MODULE();

+ (id)allocWithZone:(NSZone *)zone {
    static NotificationModule *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [super allocWithZone:zone];
    });
    return sharedInstance;
}

RCT_EXPORT_METHOD(Register)
{
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  [center requestAuthorizationWithOptions:(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge) completionHandler:^(BOOL granted, NSError * _Nullable error){
      if(!error){
        dispatch_async(dispatch_get_main_queue(), ^{
          [[UIApplication sharedApplication] registerForRemoteNotifications];
        });
      } else {
        NSLog(@"fapa=error==%@", error);
      }
  }];
}

NSString *_DeviceID = NULL;
RCT_EXPORT_METHOD(DeviceID:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (_DeviceID != NULL) {
    resolve (_DeviceID);
  } else {
    resolve (NULL);
  }
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onDeviceId"];
}
- (void)onDeviceToken:(NSData *)deviceToken {
    if (self.bridge) {
      NSUInteger len = deviceToken.length;
      const unsigned char *buffer = deviceToken.bytes;
      NSMutableString *hexString  = [NSMutableString stringWithCapacity:(len * 2)];
      for (int i = 0; i < len; ++i) {
          [hexString appendFormat:@"%02x", buffer[i]];
      }
      _DeviceID = [hexString copy];
    }
}

NSString *_DeepLink = NULL;
RCT_EXPORT_METHOD(DeepLink:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  
  NSLog(@"DeepLink Request%@",_DeepLink);
  
  if (_DeepLink != NULL) {
    NSLog(@"onDeepLink=%@", _DeepLink);
    NSString *_Temp = [NSString stringWithString:_DeepLink];
    _DeepLink = NULL;
    resolve (_Temp);
  } else {
    resolve (@"null");
  }
}
- (void)onDeepLink:(NSString *)deepLink {
  NSLog(@"onDeepLink NOTIFICATION MODULE=%@", deepLink);
  _DeepLink = deepLink;
}

@end
