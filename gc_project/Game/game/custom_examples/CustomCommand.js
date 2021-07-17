var CommandExecute;
(function (CommandExecute) {
    function customCommand_1(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        for (var i = 0; i < p.num; i++) {
            Game.player.data.photos.push(p.photos);
        }
        var uiPhotos = GameUI.get(2);
        if (uiPhotos && uiPhotos.stage)
            uiPhotos.refreshPhoto();
    }
    CommandExecute.customCommand_1 = customCommand_1;
    function customCommand_2(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        GameUI.dispose(1);
        SinglePlayerGame.newGame();
    }
    CommandExecute.customCommand_2 = customCommand_2;
})(CommandExecute || (CommandExecute = {}));
//# sourceMappingURL=CustomCommand.js.map