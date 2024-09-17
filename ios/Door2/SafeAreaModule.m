#import "SafeAreaModule.h"
#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>


@implementation SafeAreaModule

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(getInsets:(RCTPromiseResolveBlock)resolve
                  reject:(__unused RCTPromiseRejectBlock)reject)
{
  if (@available(iOS 11.0, *)) {
    UIWindow *window = UIApplication.sharedApplication.windows.firstObject;
    CGFloat topPadding = window.safeAreaInsets.top;
    CGFloat bottomPadding = window.safeAreaInsets.bottom;
    NSMutableDictionary *dict = [[NSMutableDictionary alloc]init];
    [dict setValue:[NSNumber numberWithFloat:topPadding] forKey:@"top"];
    [dict setValue:[NSNumber numberWithFloat:bottomPadding] forKey:@"bottom"];
    resolve(dict);
  } else {
    NSMutableDictionary *dict = [[NSMutableDictionary alloc]init];
    [dict setValue:[NSNumber numberWithFloat:0] forKey:@"top"];
    [dict setValue:[NSNumber numberWithFloat:0] forKey:@"bottom"];
    resolve(dict);
  }
}

@end
