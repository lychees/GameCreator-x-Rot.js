/**
 * 示例-游戏玩家-项目层实现类
 * 
 * Created by 黑暗之神KDS on 2020-03-03 09:04:41.
 */
class ProjectPlayer extends ClientPlayer {
    /**
     * 玩家的游戏对象数据：重写以便类别能够指向项目层的ProjectSceneObject_1，方便调用
     */
    public sceneObject: ProjectSceneObject_1;
    /**
     * 构造函数
     */
    constructor(){
        super(true);
    }
}