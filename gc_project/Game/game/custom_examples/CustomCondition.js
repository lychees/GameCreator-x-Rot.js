var CustomCondition;
(function (CustomCondition) {
    function f1(trigger, p) {
        if (p.soType == 0) {
            return Game.player.sceneObject.name == p.soName;
        }
        else if (p.soType == 1) {
            return trigger.trigger.name == p.soName;
        }
        else if (p.soType == 2) {
            return trigger.executor.name == p.soName;
        }
        else {
            if (!Game.currentScene)
                return false;
            var so = Game.currentScene.sceneObjects[p.soIndex];
            if (!so)
                return false;
            return so.name == p.soName;
        }
    }
    CustomCondition.f1 = f1;
})(CustomCondition || (CustomCondition = {}));
//# sourceMappingURL=CustomCondition.js.map