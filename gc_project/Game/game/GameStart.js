var Game = new ProjectGame();
if (!Config.BEHAVIOR_EDIT_MODE) {
    EventUtils.addEventListener(ClientWorld, ClientWorld.EVENT_INITED, Callback.New(function () {
        var _this = this;
        GameUI.show(1);
        if (Browser.onMobile) {
            stage.screenMode = ClientWorld.data.screenMode == 0 ? "horizontal" : "vertical";
            alert(stage.screenMode);
            stage.setScreenSize(Browser.width, Browser.height);
        }
        EventUtils.addEventListener(ClientScene, ClientScene.EVENT_IN_NEW_SCENE, Callback.New(function (sceneModelID, state) {
            if (Game.currentScene) {
                Game.currentScene.dispose();
                Game.currentScene = null;
            }
            ClientScene.createScene(sceneModelID, null, Callback.New(function (scene) {
                Game.currentScene = scene;
                scene.startRender();
                Game.layer.sceneLayer.addChild(scene.displayObject);
                var soDatas = scene.getPresetSceneObjectDatas();
                for (var i = 0; i < soDatas.length; i++) {
                    var so = soDatas[i];
                    if (!so)
                        continue;
                    var soc = scene.addSceneObjectFromClone(scene.id, i, true);
                }
                var soc = scene.addSceneObject(Game.player.data.sceneObject, false, true);
                scene.camera.sceneObject = soc;
                Game.player.sceneObject = soc;
                if (state == 2) {
                    SinglePlayerGame.recoveryData();
                }
                else {
                    var inSceneCmdIndex = 0;
                    var inSceneCmdPage = Game.currentScene.customCommandPages[inSceneCmdIndex];
                    if (inSceneCmdPage.commands.length > 0) {
                        var commandTriggerInScene = Game.player.sceneObject.getCommandTrigger(CommandTrigger.COMMAND_MAIN_TYPE_SCENE, inSceneCmdIndex, Game.currentScene, Game.player.sceneObject);
                        inSceneCmdPage.startTriggerEvent(commandTriggerInScene);
                    }
                }
            }, _this));
        }, this));
    }, this), true);
}
//# sourceMappingURL=GameStart.js.map