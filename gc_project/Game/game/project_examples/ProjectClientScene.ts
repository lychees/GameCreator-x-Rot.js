/**
 * 编辑器配置
 * Created by 黑暗之神KDS on 2020-09-08 17:10:24.
 */
class ProjectClientScene extends ClientScene {
    /**
     * 场景对象列表：场景上全部的场景对象
     * 重写，如果确保场景上只有ClientSceneObject_1的话则可以如此使用，方便代码调用
     */
    sceneObjects: ClientSceneObject_1[];
    /**
     * 构造函数
     */
    constructor() {
        super();
    }
}