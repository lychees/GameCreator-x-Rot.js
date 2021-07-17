/**
 * 场景对象绑定类示例
 * -- 继承了系统生成的 ClientSceneObject_1
 * Created by 黑暗之神KDS on 2020-09-08 17:00:01.
 */
class ProjectSceneObject_1 extends ClientSceneObject_1 {
    /**
     * 行为集，由多个行为组合而成，重写变量属性以便类别指向项目层的 ProjectSceneObjectBehaviors
     */
    protected behaviors: ProjectSceneObjectBehaviors[] = [];
    /**
     * 构造函数
     * @param soData 场景对象数据
     * @param scene 所属场景
     */
    constructor(soData: SceneObject, scene: ClientScene) {
        super(soData, scene);
        this.clearBehaviors
    }
    //------------------------------------------------------------------------------------------------------
    // 
    //------------------------------------------------------------------------------------------------------
    /**
     * 刷新：场景会调用所有场景上的场景对象的该函数
     * @param nowTime 游戏时间戳（Game.pause会暂停游戏时间戳）
     */
    update(nowTime: number): void {
        super.update(nowTime);
        // 更新对象行为
        this.updateBehavior();
    }
    //------------------------------------------------------------------------------------------------------
    // 行为
    //------------------------------------------------------------------------------------------------------
    /**
     * 添加一组行为
     * @param behaviorData 行为数据
     * @param loop 是否循环
     * @param targetPlayerSceneObject 存在的玩家目标对象
     * @param onOver 当行为结束时回调
     * @param cover 覆盖旧的行为
     * @param startIndex [可选] 默认值=0 行为起始索引
     * @param Immediate [可选] 默认值=true 是否立即执行，否则等待帧刷
     * @param forceStopLastBehavior  [可选] 默认值=false 是否强制停止此前正在执行的行为
     */
    addBehavior(behaviorData: any[], loop: boolean, targetSceneObject: ProjectSceneObject_1, onOver: Callback, cover: boolean, startIndex: number = 0, Immediate: boolean = true, forceStopLastBehavior: boolean = false) {
        // 新建一层行为，当该层行为结束时，通知并直接立刻继续执行上一层的行为
        var soBehavior: ProjectSceneObjectBehaviors = new ProjectSceneObjectBehaviors(this, loop, targetSceneObject as any, Callback.New((onOver: Callback) => {
            this.behaviors.pop();
            onOver && onOver.run();
            this.updateBehavior();
        }, this, [onOver]), startIndex);
        soBehavior.setBehaviors(behaviorData);
        // 如果是forceStopLastBehavior需要立刻停止
        if (forceStopLastBehavior) {
            // to do 停止当前正在执行的行为以便此次派发的新行为组能够立刻执行
        }
        // 覆盖模式下清空原行为
        if (cover) this.behaviors.length = 0;
        this.behaviors.push(soBehavior);
        // 立即执行行为
        if (Immediate) this.updateBehavior();
        return soBehavior;
    }
    /**
     * 刷新行为
     */
    protected updateBehavior() {
        // 处于行为编辑器中时忽略
        if (Config.BEHAVIOR_EDIT_MODE) return;
        // 存在行为的话则执行
        if (this.behaviors.length > 0) {
            var newestBehavior = this.behaviors[this.behaviors.length - 1];
            newestBehavior.update();
        }
    }

}