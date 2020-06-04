/****************************************************************************
 Copyright (c) 2013      cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#import "RootViewController.h"
#import "cocos2d.h"

#include "platform/CCApplication.h"
#include "platform/ios/CCEAGLView-ios.h"


#import "cocos/scripting/js-bindings/jswrapper/SeApi.h"

static int PhotoIndex = 0;
static RootViewController* selfapp = nullptr;
UIImagePickerController *_picker;

@implementation RootViewController

/*
// The designated initializer.  Override if you create the controller programmatically and want to perform customization that is not appropriate for viewDidLoad.
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
if ((self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil])) {
// Custom initialization
}
return self;
}
*/

// Implement loadView to create a view hierarchy programmatically, without using a nib.
- (void)loadView {
    // Set EAGLView as view of RootViewController
    self.view = (__bridge CCEAGLView *)cocos2d::Application::getInstance()->getView();
}

// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad {
    if(selfapp == nullptr){
        selfapp = self;
    }
    [super viewDidLoad];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
}

- (void)viewDidDisappear:(BOOL)animated {
    [super viewDidDisappear:animated];
}


// For ios6, use supportedInterfaceOrientations & shouldAutorotate instead
#ifdef __IPHONE_6_0
- (NSUInteger) supportedInterfaceOrientations{
    return UIInterfaceOrientationMaskAllButUpsideDown;
}
#endif

- (BOOL) shouldAutorotate {
    return YES;
}

- (void)didRotateFromInterfaceOrientation:(UIInterfaceOrientation)fromInterfaceOrientation {
    [super didRotateFromInterfaceOrientation:fromInterfaceOrientation];
}

//fix not hide status on ios7
- (BOOL)prefersStatusBarHidden {
    return YES;
}

// Controls the application's preferred home indicator auto-hiding when this view controller is shown.
- (BOOL)prefersHomeIndicatorAutoHidden {
    return YES;
}

- (void)didReceiveMemoryWarning {
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];

    // Release any cached data, images, etc that aren't in use.
}


- (UIImagePickerController *)picker
{
    if (!_picker) {
        _picker = [[UIImagePickerController alloc]init];
    }
    return _picker;
}

+(void) onOpenAlbum:(NSString* )index {
    PhotoIndex = [index intValue];
    [selfapp openAlbum];
}

- (void)openAlbum
{
    // 弹出系统的相册
    // 选择控制器（系统相册）
    //    UIImagePickerController * picker = [[UIImagePickerController alloc] init];
    
    // 设置选择控制器的来源
    // UIImagePickerControllerSourceTypePhotoLibrary 相册集
    // UIImagePickerControllerSourceTypePhotoLibrary
    // UIImagePickerControllerSourceTypeSavedPhotosAlbum:照片库
    UIImagePickerController* picker = [self picker];
    picker.sourceType = UIImagePickerControllerSourceTypeSavedPhotosAlbum;
    
    // 设置代理
    picker.delegate = (id)self;
//    picker.allowsEditing = YES;
    // modal
    [self presentViewController:picker animated:YES completion:nil];
}

- (UIImage *)scaleImage:(UIImage *)image toScale:(float)scaleSize
{
    UIGraphicsBeginImageContext(CGSizeMake(image.size.width * scaleSize, image.size.height * scaleSize));
    [image drawInRect:CGRectMake(0, 0, image.size.width * scaleSize, image.size.height * scaleSize)];
    UIImage *scaledImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return scaledImage;
}
                                
//当选择一张图片后进入这里
-(void)imagePickerController:(UIImagePickerController*)picker didFinishPickingMediaWithInfo:(NSDictionary *)info

{
    NSString *type = [info objectForKey:UIImagePickerControllerMediaType];
    
    //当选择的类型是图片
    if ([type isEqualToString:@"public.image"])
    {
        //先把图片转成NSData
        UIImage* image = [info objectForKey:@"UIImagePickerControllerOriginalImage"];
        CGFloat w = image.size.width;// bitImage.getWidth();
        CGFloat h = image.size.height;
        if (w > 1024 || h > 1024) {
            image = [self scaleImage:image toScale:MIN(1.0f / (w / 1024), 1.0f / (h / 1024))];
        }
        
        NSData *data;
        data = UIImageJPEGRepresentation(image, 0.2);

        
        //图片保存的路径
        //这里将图片放在沙盒的documents文件夹中
        //        NSString * DocumentsPath = [NSHomeDirectory() stringByAppendingPathComponent:@"Documents"];
        std::string wPath = cocos2d::FileUtils::getInstance()->getWritablePath();
        NSString *DocumentsPath= [NSString stringWithCString:wPath.c_str() encoding:[NSString defaultCStringEncoding]];
        //文件管理器
        NSFileManager *fileManager = [NSFileManager defaultManager];
        NSString *fileName = [NSString stringWithFormat:@"/%d.jpg",PhotoIndex];
        NSLog(@"图片名称是：%@", fileName);
        
        //把刚刚图片转换的data对象拷贝至沙盒中 并保存为image.png
        [fileManager createDirectoryAtPath:DocumentsPath withIntermediateDirectories:YES attributes:nil error:nil];
        [fileManager createFileAtPath:[DocumentsPath stringByAppendingString: fileName] contents:data attributes:nil];
        
        //得到选择后沙盒中图片的完整路径
        NSString* filePath = [[NSString alloc]initWithFormat:@"%@%@",DocumentsPath,fileName];
        //        _launchIndex += 1;
        //关闭相册界面
        [picker dismissModalViewControllerAnimated:YES];
        
        NSLog(@"图片的路径是：%@", filePath);
        //        std::string filePathStr = [filePath UTF8String];
        std::string PhotoIndexStr = std::to_string(PhotoIndex);
        std::string str = "cc.game.emit(\"PhotoPath\", " + PhotoIndexStr + ");";
        se::ScriptEngine::getInstance()->evalString(str.c_str());
        
        //图片2进制路径
        //        //strFilePath = [filePath UTF8String];
        //        const char * filePathChar = [filePath UTF8String];
        //        /////
        //        int scriptHandler = [[LaunchCameraManager getInstance] getScriptHandler];
        //        if (scriptHandler)
        //        {
        //            LuaBridge::pushLuaFunctionById(scriptHandler);
        //            LuaStack *stack = LuaBridge::getStack();
        //            stack->pushString(filePathChar);
        //            stack->executeFunction(1);
        //        }
        
    }
    
}

@end
