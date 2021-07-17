/**
 * 自定义事件命令-示例
 * Created by 黑暗之神KDS on 2020-09-09 19:47:24.
 */
module CommandExecute {
    /**
     * 自定义命令执行示例1：获得照片
     * @param commandPage 事件页
     * @param cmd 当前的事件命令
     * @param trigger 触发器
     * @param triggerPlayer 触发器对应的玩家
     * @param playerInput 玩家输入值（如有）
     * @param p 自定义命令参数
     */
    export function customCommand_1(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_1): void {
        // 给与指定张数的照片
        for (var i = 0; i < p.num; i++) {
            Game.player.data.photos.push(p.photos);
        }
        // 刷新界面显示（如有且在显示状态中的时候）
        var uiPhotos = (GameUI.get(2) as GUI_Photos)
        if (uiPhotos && uiPhotos.stage) uiPhotos.refreshPhoto();
    }
    /**
     * 自定义命令示例2：开始游戏
     * @param commandPage 事件页
     * @param cmd 当前的事件命令
     * @param trigger 触发器
     * @param triggerPlayer 触发器对应的玩家
     * @param playerInput 玩家输入值（如有）
     * @param p 自定义命令参数
     */
    export function customCommand_2(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_2): void {
        // 销毁1号界面
        GameUI.dispose(1);
        // 新的游戏开始
        SinglePlayerGame.newGame();
    }
}