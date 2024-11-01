#import <React/RCTBridgeModule.h>
#import <AVFoundation/AVFoundation.h>

@interface RNAudio : NSObject <RCTBridgeModule>
@property (nonatomic, strong) AVPlayer *player;
@end
