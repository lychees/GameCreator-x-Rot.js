//------------------------------------------------------------------------------------------------------
// 内核入口
//------------------------------------------------------------------------------------------------------
// 创建Game类，全局使用
var Game: ProjectGame = new ProjectGame();
// 非行为编辑器中

if (!Config.BEHAVIOR_EDIT_MODE) {
    // 监听客户端初始化完毕事件
    EventUtils.addEventListener(ClientWorld, ClientWorld.EVENT_INITED, Callback.New(function () {
        // 显示1号界面作为标题界面，标题界面执行点击事件时会使用自定义的事件命令-开始游戏 实现：CommandExecute.customCommand_2
        GameUI.show(1);
        // 移动端屏幕显示
        if (Browser.onMobile) {
            stage.screenMode = ClientWorld.data.screenMode == 0 ? "horizontal" : "vertical";
            alert(stage.screenMode)
            stage.setScreenSize(Browser.width, Browser.height);
        }
    }, this), true);
}