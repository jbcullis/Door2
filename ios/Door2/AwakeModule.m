#import "AwakeModule.h"
#import "UIKit/UIKit.h"

@implementation AwakeModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(setAwake:(BOOL)screenShouldBeKeptOn)
{
  dispatch_sync(dispatch_get_main_queue(), ^{
    [[UIApplication sharedApplication] setIdleTimerDisabled:screenShouldBeKeptOn];
  });
}

RCT_EXPORT_METHOD(getAwake:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if([UIApplication sharedApplication].idleTimerDisabled) {
    resolve(@YES);
  } else {
    resolve(@NO);
  }
}

@end
