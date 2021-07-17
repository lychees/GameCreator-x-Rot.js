




var ProjectSceneObject_1 = (function (_super) {
    __extends(ProjectSceneObject_1, _super);
    function ProjectSceneObject_1(soData, scene) {
        _super.call(this, soData, scene);
        this.behaviors = [];
        this.clearBehaviors;
    }
    ProjectSceneObject_1.prototype.update = function (nowTime) {
        _super.prototype.update.call(this, nowTime);
        this.updateBehavior();
    };
    ProjectSceneObject_1.prototype.addBehavior = function (behaviorData, loop, targetSceneObject, onOver, cover, startIndex, Immediate, forceStopLastBehavior) {
        var _this = this;
        if (startIndex === void 0) { startIndex = 0; }
        if (Immediate === void 0) { Immediate = true; }
        if (forceStopLastBehavior === void 0) { forceStopLastBehavior = false; }
        var soBehavior = new ProjectSceneObjectBehaviors(this, loop, targetSceneObject, Callback.New(function (onOver) {
            _this.behaviors.pop();
            onOver && onOver.run();
            _this.updateBehavior();
        }, this, [onOver]), startIndex);
        soBehavior.setBehaviors(behaviorData);
        if (forceStopLastBehavior) {
        }
        if (cover)
            this.behaviors.length = 0;
        this.behaviors.push(soBehavior);
        if (Immediate)
            this.updateBehavior();
        return soBehavior;
    };
    ProjectSceneObject_1.prototype.updateBehavior = function () {
        if (Config.BEHAVIOR_EDIT_MODE)
            return;
        if (this.behaviors.length > 0) {
            var newestBehavior = this.behaviors[this.behaviors.length - 1];
            newestBehavior.update();
        }
    };
    return ProjectSceneObject_1;
}(ClientSceneObject_1));
//# sourceMappingURL=ProjectSceneObject_1.js.map