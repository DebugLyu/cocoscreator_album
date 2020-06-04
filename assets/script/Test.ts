import { Http } from "./Http";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Test extends cc.Component {
    @property(cc.Sprite)
    photo: cc.Sprite = null;

    @property(cc.Sprite)
    photo2: cc.Sprite = null;

    start() {
        var newPaths = jsb.fileUtils.getWritablePath();
        cc.game.on("PhotoPath", (index) => {
            // 
            console.log("path:", newPaths + index + ".jpg");

            cc.loader.release(newPaths + index + ".jpg");
            cc.loader.load(newPaths + index + ".jpg", (error, res: cc.Texture2D) => {
               
                if (error) {
                    console.error("error", error.message || error);
                    return;
                }
                console.log("aaaaaaaaaaaaaaaaa:", res instanceof cc.Texture2D);
                let sprframe = new cc.SpriteFrame();
                sprframe.setTexture(res);

                console.log("width", res.width, "height", res.height);
                this.photo.spriteFrame = sprframe;
            });

            let uin8array:Uint8Array = jsb.fileUtils.getDataFromFile(newPaths + "/" + index + ".jpg");
            // // http.send(t.buffer);
            Http.post("http://192.168.124.13:8800/image?name=1.jpg", uin8array, (result) => {
                console.log(result);
            });
        });
    }

    openPhotoAlbum() {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onOpenAlbum", "(I)V", 1);
    }

    onLoadPhoto(){
        // Http.get("http://192.168.124.13:8800/download?name=1.jpg", (result) => {
        //         console.log(result);
        // });
        cc.loader.release("http://192.168.124.13:8800/download?name=1.jpg");
        cc.loader.load("http://192.168.124.13:8800/download?name=1.jpg", (error, res) => {
            if (error) {
                console.error("error", error.message || error);
                return;
            }
            console.log("aaaaaaaaaaaaaaaaa:", res instanceof cc.Texture2D);
            let sprframe = new cc.SpriteFrame();
            sprframe.setTexture(res);

            console.log("width", res.width, "height", res.height);
            this.photo2.spriteFrame = sprframe;
        })
    }
}
