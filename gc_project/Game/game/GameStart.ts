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
        // 先监听进入场景的事件：新游戏、读档、切换场景
        // @param sceneModelID 场景模型ID 
        // @param state 状态 0-切换游戏场景 1-新游戏 2-读取存档 
        EventUtils.addEventListener(ClientScene, ClientScene.EVENT_IN_NEW_SCENE, Callback.New((sceneModelID: number, state: number) => {
            // 存在上一个场景的话就释放掉
            if (Game.currentScene) {
                Game.currentScene.dispose();
                Game.currentScene = null;
            }
            // 创建场景，根据sceneModelID
            ClientScene.createScene(sceneModelID, null, Callback.New((scene: ProjectClientScene) => {
                // 记录到系统变量中：当前场景
                Game.currentScene = scene;
                // 场景开始渲染
                scene.startRender();
                // 添加到对应的显示层次
                Game.layer.sceneLayer.addChild(scene.displayObject);
                // 获取编辑器中预设的场景对象（未包含出生点）
                var soDatas = scene.getPresetSceneObjectDatas();
                for (var i = 0; i < soDatas.length; i++) {
                    var so = soDatas[i];
                    if (!so) continue;
                    // 以该方法创建会安装场景对象的
                    var soc: ProjectSceneObject_1 = scene.addSceneObjectFromClone(scene.id, i, true) as any;
                }
                // 创建玩家的对象，
                var soc = scene.addSceneObject(Game.player.data.sceneObject, false, true) as ProjectSceneObject_1;
                // 让镜头锁定主角
                scene.camera.sceneObject = soc;
                // 记录到系统变量中：玩家的场景对象
                Game.player.sceneObject = soc;
                // 读档的情况：恢复数据
                if (state == 2) {
                    SinglePlayerGame.recoveryData();
                }
                else {
                    // 场景自定义触发事件示例：获取场景的第一个自定义事件页
                    var inSceneCmdIndex = 0;
                    var inSceneCmdPage = Game.currentScene.customCommandPages[inSceneCmdIndex];
                    if (inSceneCmdPage.commands.length > 0) {
                        // 获取触发器：这里的设计是触发者和执行者都是玩家的场景对象
                        var commandTriggerInScene = Game.player.sceneObject.getCommandTrigger(CommandTrigger.COMMAND_MAIN_TYPE_SCENE, inSceneCmdIndex, Game.currentScene, Game.player.sceneObject);
                        // 开始使用这个触发器执行这一页事件
                        inSceneCmdPage.startTriggerEvent(commandTriggerInScene);
                    }
                }
            }, this));
        }, this));
    }, this), true);
}