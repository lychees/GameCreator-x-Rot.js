var Game = new ProjectGame();
if (!Config.BEHAVIOR_EDIT_MODE) {
    EventUtils.addEventListener(ClientWorld, ClientWorld.EVENT_INITED, Callback.New(function () {
        GameUI.show(1);
        if (Browser.onMobile) {
            stage.screenMode = ClientWorld.data.screenMode == 0 ? "horizontal" : "vertical";
            alert(stage.screenMode);
            stage.setScreenSize(Browser.width, Browser.height);
        }
    }, this), true);
}
//# sourceMappingURL=GameStart.js.map