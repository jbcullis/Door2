#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTComponent.h>

@interface RNPhoto : NSObject <RCTBridgeModule, UIImagePickerControllerDelegate, UINavigationControllerDelegate>
@property (nonatomic, strong) RCTPromiseResolveBlock resolve;
@property (nonatomic, strong) RCTPromiseRejectBlock reject;
@end
