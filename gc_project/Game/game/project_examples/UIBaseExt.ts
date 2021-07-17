/**
 * UI控件的相关事件类别实现
 * Created by 黑暗之神KDS on 2019-08-07 13:18:39.
 */
//------------------------------------------------------------------------------------------------------
// 界面组件扩展
//------------------------------------------------------------------------------------------------------
// 监听每个组件的构造事件（创建预设界面时才会派发，而自行创建的组件不会派发该事件）
EventUtils.addEventListener(UIBase, UIBase.EVENT_COMPONENT_CONSTRUCTOR_INIT, Callback.New(uiComponentInit, this));
/**
 * 组件初始化
 * @param uiComp 组件
 */
function uiComponentInit(uiComp: UIBase) {
    // 第一个界面的自定义事件：点击事件，可在菜单-自定义编辑器-触发事件类别-界面组件事件类别中设置
    var clickEventIndex = 0;
    // 点击事件实现：当存在点击事件页内容的情况时
    if (uiComp.hasCommand[clickEventIndex]) {
        // 强行开启父节点的鼠标响应，以防止误操作关闭了父节点的鼠标响应从而无法执行点击事件
        var p = uiComp;
        while (p) {
            p.mouseEnabled = true;
            if (p == uiComp.guiRoot) {
                break;
            }
            p = p.parent as any;
        }
        // 注册点击事件
        uiComp.on(EventObject.CLICK, uiComp, () => {
            // 获取该组件绑定的玩家提交信息。主要用于绑定后将该信息提交到事件里面
            // 在事件页中可通过玩家输入值来获取（事件中的脚本则是：trigger.inputMessage）
            var commandInputMessage;
            if (uiComp.commandInputMessage instanceof Callback) {
                commandInputMessage = (uiComp.commandInputMessage as Callback).run();
            }
            else {
                commandInputMessage = uiComp.commandInputMessage;
            }
            // 开始执行界面组件事件
            GameCommand.startUICommand(uiComp, clickEventIndex, commandInputMessage);
        });
    }
}