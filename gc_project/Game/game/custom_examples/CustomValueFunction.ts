/**
 * 自定义常用函数-示例
 * Created by 黑暗之神KDS on 2020-09-09 19:47:24.
 */
module CustomValueFunction {
    /**
     * 自定义游戏数值示例-当前时间的小时数
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数 
     */
    export function f1(trigger: CommandTrigger, triggerPlayer: ProjectPlayer): number {
        return (new Date()).getHours();
    }
}