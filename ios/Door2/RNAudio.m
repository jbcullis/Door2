#import "RNPhoto.h"
#import "UIKit/UIKit.h"

@implementation RNPhoto

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(pickPhoto,
                 pickResolver:(RCTPromiseResolveBlock)resolve
                 pickRejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    UIImagePickerController *picker = [[UIImagePickerController alloc] init];
    picker.delegate = self;
    picker.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;

    UIViewController *root = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
    [root presentViewController:picker animated:YES completion:nil];

    // Store the resolve and reject blocks
    self.resolve = resolve;
    self.reject = reject;
  });
}
RCT_REMAP_METHOD(takePhoto,
                 takeResolver:(RCTPromiseResolveBlock)resolve
                 takeRejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    UIImagePickerController *picker = [[UIImagePickerController alloc] init];
    picker.delegate = self;
    picker.sourceType = UIImagePickerControllerSourceTypeCamera;

    UIViewController *root = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
    [root presentViewController:picker animated:YES completion:nil];

    // Store the resolve and reject blocks
    self.resolve = resolve;
    self.reject = reject;
  });
}
- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary<UIImagePickerControllerInfoKey,id> *)info
{
  UIImage *chosenImage = info[UIImagePickerControllerOriginalImage];
  NSData *imageData = UIImageJPEGRepresentation(chosenImage, 1.0);
  NSString *base64Image = [imageData base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];

  // Get the file URL, name, date, and size
  NSURL *fileURL = info[UIImagePickerControllerImageURL];
  NSString *fileName = fileURL.lastPathComponent;
  NSDictionary *fileAttributes = [[NSFileManager defaultManager] attributesOfItemAtPath:fileURL.path error:nil];
  NSNumber *fileSize = fileAttributes[NSFileSize];
    
  if (!fileName) {
    NSDate *currentDate = [NSDate date];
      NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
      [dateFormatter setDateFormat:@"yyyyMMddHHmmss"];
      NSString *dateString = [dateFormatter stringFromDate:currentDate];
      fileName = [dateString stringByAppendingString:@".jpg"];
  }
  
  //If file size is null, use imageData length as size
  if (!fileSize) {
    fileSize = @([imageData length]);
  }
  
  // Get the date taken from the image's EXIF data
  CGImageSourceRef source = CGImageSourceCreateWithURL((CFURLRef)fileURL, NULL);
  NSDictionary *metadata = (NSDictionary *)CFBridgingRelease(CGImageSourceCopyPropertiesAtIndex(source, 0, NULL));
  NSDictionary *exifData = metadata[(NSString *)kCGImagePropertyExifDictionary];
  NSString *dateTakenString = exifData[(NSString *)kCGImagePropertyExifDateTimeOriginal];
  
//Format date to readable format
  NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
  dateFormatter.dateFormat = @"yyyy-MM-dd'T'HH:mm:ssZZZZZ";
  NSDate *dateTaken = [dateFormatter dateFromString:dateTakenString];
  if (!dateTaken) {
    dateTaken = fileAttributes[NSFileCreationDate];
  }
  if (!dateTaken) {
    dateTaken = [NSDate date];
  }

  // Create a thumbnail version of the image
  CGFloat maxDimension = 300.0;
  CGSize targetSize;
  if (chosenImage.size.width > chosenImage.size.height) {
      targetSize = CGSizeMake(maxDimension, maxDimension * chosenImage.size.height / chosenImage.size.width);
  } else {
      targetSize = CGSizeMake(maxDimension * chosenImage.size.width / chosenImage.size.height, maxDimension);
  }
  UIGraphicsBeginImageContextWithOptions(targetSize, NO, 0.0);
  [chosenImage drawInRect:CGRectMake(0, 0, targetSize.width, targetSize.height)];
  UIImage *thumbnailImage = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  NSData *thumbnailImageData = UIImageJPEGRepresentation(thumbnailImage, 0.5);
  NSString *base64ThumbnailImage = [thumbnailImageData base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
  
  // Create the result object
  NSDictionary *result = @{
    @"fileName": fileName,
    @"fileDate": [dateFormatter stringFromDate:dateTaken],
    @"fileSize": fileSize,
    @"fileThumbnail": base64ThumbnailImage,
    @"fileContents": base64Image
  };
  
  [picker dismissViewControllerAnimated:YES completion:^{
    self.resolve(result);
  }];
}
- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker
{
  [picker dismissViewControllerAnimated:YES completion:^{
    //NSError *error = [NSError errorWithDomain:@"user_cancelled" code:1 userInfo:nil];
    //self.reject(@"E_PICKER_CANCELLED", @"User cancelled image picker", error);
    self.resolve([NSNull null]);
  }];
}


RCT_EXPORT_METHOD(Thumbnail: (NSString *)base64String resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  dispatch_sync(dispatch_get_main_queue(), ^{
    // Decode the base64 string into an NSData object
    NSData *imageData = [[NSData alloc] initWithBase64EncodedString:base64String options:NSDataBase64DecodingIgnoreUnknownCharacters];
    UIImage *image = [UIImage imageWithData:imageData];
    
    // Calculate the target size for the thumbnail
    CGFloat maxDimension = 300.0;
    CGSize targetSize;
    if (image.size.width > image.size.height) {
        targetSize = CGSizeMake(maxDimension, maxDimension * image.size.height / image.size.width);
    } else {
        targetSize = CGSizeMake(maxDimension * image.size.width / image.size.height, maxDimension);
    }
    
    // Draw the image into a new graphics context with the target size
    UIGraphicsBeginImageContextWithOptions(targetSize, NO, 0.0);
    [image drawInRect:CGRectMake(0, 0, targetSize.width, targetSize.height)];
    UIImage *thumbnail = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    // Convert the thumbnail image back into a base64 string
    NSData *thumbnailData = UIImageJPEGRepresentation(thumbnail, .5);
    NSString *base64ThumbnailString = [thumbnailData base64EncodedStringWithOptions:NSDataBase64Encoding64CharacterLineLength];
    
    return resolve(base64ThumbnailString);
  });
}

@end
