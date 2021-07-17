/**
 * 自定义条件分歧-示例
 * Created by 黑暗之神KDS on 2020-09-09 19:47:24.
 */
module CustomCondition {
    /**
     * 自定义条件：1表示对应ID=1的自定义条件
     * @param trigger 事件触发器
     * @param p 自定义参数
     * @return [boolean] 
     */
    export function f1(trigger: CommandTrigger, p: CustomConditionParams_1): boolean {
        // 匹配玩家的场景对象名字
        if (p.soType == 0) {
            return Game.player.sceneObject.name == p.soName;
        }
        // 匹配触发者的场景对象名字
        else if (p.soType == 1) {
            return trigger.trigger.name == p.soName;
        }
        // 匹配执行者的场景对象名字
        else if (p.soType == 2) {
            return trigger.executor.name == p.soName;
        }
        // 匹配指定场景编号的场景对象名字
        else {
            if (!Game.currentScene) return false;
            var so = Game.currentScene.sceneObjects[p.soIndex];
            if (!so) return false;
            return so.name == p.soName;
        }
    }
}