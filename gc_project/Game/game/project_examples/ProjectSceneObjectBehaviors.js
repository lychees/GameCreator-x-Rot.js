




var ProjectSceneObjectBehaviors = (function (_super) {
    __extends(ProjectSceneObjectBehaviors, _super);
    function ProjectSceneObjectBehaviors() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(ProjectSceneObjectBehaviors.prototype, "logicPause", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    ProjectSceneObjectBehaviors.prototype.reset = function (defSceneObejct) {
        ObjectUtils.clone(defSceneObejct, this.so);
        this.so.stopAllAnimation();
        this.so.drawShadow();
        this.so.scene.camera.sceneObject = this.so;
        this.so.scene.updateCamera();
        this.so.scale = 1;
        if (ProjectSceneObjectBehaviors.soScaleTween)
            Tween.clear(ProjectSceneObjectBehaviors.soScaleTween);
    };
    ProjectSceneObjectBehaviors.prototype.behavior0 = function (avatarID, actID, frame, ori) {
        if (ori === void 0) { ori = null; }
        this.so.avatarID = avatarID;
        this.so.avatarAct = actID;
        this.so.avatarFrame = frame;
        this.so.avatarOri = ori;
    };
    ProjectSceneObjectBehaviors.prototype.behavior1 = function (scale, t) {
        if (this.ignoreProcess) {
            this.so.scale = scale;
        }
        else {
            if (ProjectSceneObjectBehaviors.soScaleTween)
                Tween.clear(ProjectSceneObjectBehaviors.soScaleTween);
            ProjectSceneObjectBehaviors.soScaleTween = Tween.to(this.so, { scale: scale }, t * 1000);
            this.so.off(GameSprite.ON_DISPOSE, this, this.onSoDispose);
            this.so.once(GameSprite.ON_DISPOSE, this, this.onSoDispose);
        }
    };
    ProjectSceneObjectBehaviors.prototype.behavior2 = function (frame) {
        this.waitFrame(frame);
    };
    ProjectSceneObjectBehaviors.prototype.onSoDispose = function () {
        if (ProjectSceneObjectBehaviors.soScaleTween)
            Tween.clear(ProjectSceneObjectBehaviors.soScaleTween);
        ProjectSceneObjectBehaviors.soScaleTween = null;
    };
    return ProjectSceneObjectBehaviors;
}(SceneObjectBehaviors));
SceneObjectBehaviors.implClass = ProjectSceneObjectBehaviors;
//# sourceMappingURL=ProjectSceneObjectBehaviors.js.map