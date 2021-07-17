/**
 * 自定义场景对象行为示例
 * 一个对象可能拥有多层行为，当前总是执行最后层的行为
 * 当行为播放完毕的时候根据循环决定是否重复播放或是清除行为
 * 当处于logicPause状态下时会不在继续执行后面的行为
 * 
 * Created by 黑暗之神KDS on 2019-08-07 13:24:13.
 */
class ProjectSceneObjectBehaviors extends SceneObjectBehaviors {
    /**
     * 对应的场景对象
     */
    so: ClientSceneObject;
    /**
     * 目标玩家的场景对象
     */
    protected targetPlayerSceneObject: ClientSceneObject;
    /**
     * 逻辑用的暂停标识，比如行为在运动结束前不在执行下一步动作（如配合Game.pause的效果）
     * 实现类可以根据具体的游戏规则重写该属性，以便能够正确的暂停下一步行为执行
     * 如RPG中处于移动中的对象只有等待执行完毕后再继续执行：
     */
    protected get logicPause(): boolean {
        return false;
    }
    /**
     * 重置：还原到最初始的状态
     * 仅在行为编辑器预览使用，项目层需要实现行为的重置，以便预览时能够正确显示效果
     */
    reset(defSceneObejct: SceneObject): void {
        ObjectUtils.clone(defSceneObejct, this.so);
        this.so.stopAllAnimation();
        this.so.drawShadow();
        this.so.scene.camera.sceneObject = this.so;
        this.so.scene.updateCamera();
        this.so.scale = 1;
        if (ProjectSceneObjectBehaviors.soScaleTween) Tween.clear(ProjectSceneObjectBehaviors.soScaleTween);
    }
    //------------------------------------------------------------------------------------------------------
    // 行为处理
    //------------------------------------------------------------------------------------------------------
    /**
     * 设置行走图
     * 该行为系统内置，由项目层实现
     * @param avatarID 行走图ID
     * @param actID 动作
     * @param frame 帧数
     * @param ori  [可选] 默认值=null 表示面向
     */
    private behavior0(avatarID: number, actID: number, frame: number, ori: number = null): void {
        this.so.avatarID = avatarID;
        this.so.avatarAct = actID;
        this.so.avatarFrame = frame;
        this.so.avatarOri = ori;
    }
    /**
     * 自定义行为示例：在一定时间改变体型
     * 利用可视化自定义行为编辑器编辑该行为的面板：菜单-自定义编辑器-行为编辑器
     * @param scale 行走图ID
     * @param t 动作
     */
    private static soScaleTween: Tween;
    private behavior1(scale: number, t: number): void {
        // 忽略过程的话直接设值：为了行为编辑器预览用
        if (this.ignoreProcess) {
            this.so.scale = scale;
        }
        // 播放行为时缓动形式播放
        else {
            if (ProjectSceneObjectBehaviors.soScaleTween) Tween.clear(ProjectSceneObjectBehaviors.soScaleTween);
            ProjectSceneObjectBehaviors.soScaleTween = Tween.to(this.so, { scale: scale }, t * 1000);
            // 监听对象释放时事件，以便移除掉缓动Tween
            this.so.off(GameSprite.ON_DISPOSE, this, this.onSoDispose);
            this.so.once(GameSprite.ON_DISPOSE, this, this.onSoDispose);
        }
    }
    /**
     * 自定义行为示例：等待一定帧数
     * 只有等待完毕才会执行后面的行为
     * @param frame 等待的帧数
     */
    private behavior2(frame: number): void {
        this.waitFrame(frame);
    }
    //------------------------------------------------------------------------------------------------------
    // 内部方法
    //------------------------------------------------------------------------------------------------------
    /**
     * 当场景对象释放时
     */
    private onSoDispose() {
        if (ProjectSceneObjectBehaviors.soScaleTween) Tween.clear(ProjectSceneObjectBehaviors.soScaleTween);
        ProjectSceneObjectBehaviors.soScaleTween = null;
    }
}
SceneObjectBehaviors.implClass = ProjectSceneObjectBehaviors;
