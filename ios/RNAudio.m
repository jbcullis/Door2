#import "RNAudio.h"
#import <React/RCTLog.h>

@implementation RNAudio

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(Play:(NSString *)url)
{
  NSURL *soundURL = [NSURL URLWithString:url];
  self.player = [AVPlayer playerWithURL:soundURL];
  [self.player play];
}

@end
