EventUtils.addEventListener(UIBase, UIBase.EVENT_COMPONENT_CONSTRUCTOR_INIT, Callback.New(uiComponentInit, this));
function uiComponentInit(uiComp) {
    var clickEventIndex = 0;
    if (uiComp.hasCommand[clickEventIndex]) {
        var p = uiComp;
        while (p) {
            p.mouseEnabled = true;
            if (p == uiComp.guiRoot) {
                break;
            }
            p = p.parent;
        }
        uiComp.on(EventObject.CLICK, uiComp, function () {
            var commandInputMessage;
            if (uiComp.commandInputMessage instanceof Callback) {
                commandInputMessage = uiComp.commandInputMessage.run();
            }
            else {
                commandInputMessage = uiComp.commandInputMessage;
            }
            GameCommand.startUICommand(uiComp, clickEventIndex, commandInputMessage);
        });
    }
}
//# sourceMappingURL=UIBaseExt.js.map