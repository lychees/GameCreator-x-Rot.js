/**
 * 自定义游戏数值-示例
 * Created by 黑暗之神KDS on 2020-09-09 19:47:24.
 */
module CumtomDataDisplay {
    /**
     * 自定义数值显示
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数 
     */
    export function f1(trigger: CommandTrigger, p: CustomDataDisplayParams_1): number {
        if (p.type == 0) {
            return Game.player.data.photos.length;
        }
        else {
            return ArrayUtils.getElementSize(Game.player.data.photos, p.photo);
        }
    }
}