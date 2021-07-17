/**
 * 界面绑定类示例：相册界面
 * Created by 黑暗之神KDS on 2020-09-09 19:47:24.
 */
class GUI_Photos extends GUI_2 {
    /**
     * 构造函数
     */
    constructor() {
        super();
        // 注册每当界面显示时事件
        this.on(EventObject.DISPLAY, this, this.refreshPhoto);
    }
    /**
     * 刷新相片
     */
    refreshPhoto() {
        var arr = [];
        // 遍历玩家的自定义属性-相册
        for (var i = 0; i < Game.player.data.photos.length; i++) {
            // 创建List需要的项数据（ListItem_3为系统自动生成，根据3号界面的元件会自动生成对应的变量以供赋值使用）
            // 关于元件类别对应的属性变量类型可参考 UIList.api
            var d = new ListItem_3;
            // 获取玩家相册数据：相片ID（由于这里只是简单的引用关系，所以记录的是一个number类型的ID）
            var photoID = Game.player.data.photos[i];
            // 获取数据库预设的相片数据
            var presetPhotoModule: Module_照片 = GameData.getModuleData(1, photoID);
            // 使用相片数据的相片路径地址
            d.pic = presetPhotoModule.picture;
            arr.push(d);
        }
        // UIList根据项数据自动创建对应的界面，如果有5个项数据则创建5个3号界面。
        this.photoList.items = arr;
    }
}
