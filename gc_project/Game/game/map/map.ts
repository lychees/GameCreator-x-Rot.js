
class Map {
    
    width: number;
    height: number;
    name: string;

    layer: any[][][];
    shadow: boolean[][];
    agents: any[];
    player: any;

    constructor(w: number, h: number) {        
        this.width = w;
        this.height = h;        
        this.layer = new Array<any>(w);
        this.shadow = new Array<any>(w);        
        for (let x=0;x<w;++x) {
            this.layer[x] = new Array<any>(h);
            this.shadow[x] = new Array<any>(h);
            for (let y=0;y<h;++y) {         
                this.layer[x][y] = new Array<any>();
            }
        }
        this.agents = new Array<any>();
    }
    // 交互
    enter(p:any) {
        let x = p.x;
        let y = p.y;
        for (let t of this.layer[x][y]) {
            t.enter(p);
        }
    }
    // 触碰
    touch(p:any) {
        let x = p.x;
        let y = p.y;
        for (let t of this.layer[x][y]) {
            t.touch(p);
        }
    }
    // 是否在地图内部
    inMap(x: number, y:number): boolean {
        let w = this.width; let h = this.height;
        return 0 <= x && x < w && 0 <= y && y < h;
    }
    // 通行检测
    isPassable(x: number, y:number): boolean {
        if (!this.inMap(x, y)) return false;            
        for (let t of this.layer[x][y]) {     
            if (!t.passable) return false; 
        }
        return true;        
    }
    // 画某个位置的地块
    draw_tile_at(x: number, y:number) {
        Main.display.draw(x, y, null);
        let a = this.layer[x][y];
        if (a !== null) {            
            let n = a.length;
            if (this.shadow[x][y] == true) {
                a[n-1].draw_with_shadow(0.5);
            } else {
                a[n-1].draw();
            }
        }
    }
    // To do list(minakokojima): 大地图卷动
    // 画整个地图
    draw() {
        let w = this.width;
        let h = this.height;
        for (let x=0;x<w;++x) {
            for (let y=0;y<h;++y) {
                this.draw_tile_at(x, y);
            }
        }
        for (let a of this.agents) {
            a.draw();
        }
    }
    // 生成地图相关
    createTileFromSpaces(tile, spaces) {        
        var pos = spaces.splice(Math.floor(ROT.RNG.getUniform() * spaces.length), 1)[0].split(",");
        var x = parseInt(pos[0]);
        var y = parseInt(pos[1]);        
        return new tile(x, y);
    }

    gen(level: number) {
        let w = this.width;
        let h = this.height;        
        let digger;
        if (level == 0) {
            digger = new ROT.Map.EllerMaze(w, h);
        } else if (level == 1) {
            digger = new ROT.Map.Digger(w, h);
        } else {
            digger = new ROT.Map.Digger(w, h);
        }

        let spaces = [];
        let digCallback = function(x, y, v) {
            if (v) {
                this.layer[x][y].push(new Wall(x, y));
            } else {                
                this.layer[x][y].push(new Tile(x, y));                
                spaces.push(x+","+y);
            }
        }
        digger.create(digCallback.bind(this));
        
        // 生成玩家
        let player = this.createTileFromSpaces(Player, spaces);  
        this.agents.push(player);
        this.player = player;
        Main.player = player;

        // 生成出口
        let exit = this.createTileFromSpaces(Exit, spaces);
        this.layer[exit.x][exit.y].push(exit);        
        // 生成箱子与钥匙        
        if (level >= 1) {
            for (var i=0;i<3;i++) {
                let box = this.createTileFromSpaces(Box, spaces);                
                box.hasKey = !i;
                this.layer[box.x][box.y].push(box);
            }
            exit.needKey = true;
            // 生成卫兵
            if (level >= 2) {
                let guard = this.createTileFromSpaces(Guard, spaces);  
                this.agents.push(guard);
            }
        }
    }
}


// 地块

class Tile {
    x: number;
    y: number;
    ch: string;
    color: string;
    passable: boolean;

    constructor(_x:number=0, _y:number=0, _ch:string="  ", _color="#fff") {
        this.x = _x;
        this.y = _y;
        this.ch = _ch;
        this.color = _color;  
        this.passable = true;
    }
    enter() {
    }
    touch() {        
    }
    draw() {
        Main.display.draw(this.x, this.y, this.ch, this.color);
    }
}

class Wall extends Tile {
    constructor(_x:number=0, _y:number=0, _ch:string="墻", _color="#fff") {
        super(_x,_y,_ch,_color);
        this.passable = false;
    }
}

class Exit extends Tile {
    x: number;
    y: number;
    needKey: boolean;
    constructor(_x:number=0, _y:number=0, _ch:string="門", _color="#aaf") {
        super(_x,_y,_ch,_color);
        this.needKey = false;
    }

    enter(who: any) {
        if (!this.needKey || who.hasKey) {
            alert("你找到了出口!");
            Main.engine.lock();
            Main.back_to_title();
        } else {
            alert("锁上了!");
        }
    }
}

class Box extends Tile {
    hasKey: boolean;
    constructor(_x:number=0, _y:number=0, _ch:string="箱", _color="#ffa") {
        super(_x,_y,_ch,_color);
        this.hasKey = false;        
    }
    enter(p: any) {
        if (this.hasKey == true) {
            alert("你发现了钥匙！");
            this.hasKey = false;
            p.hasKey = true;
            this.color = "#aaa";
        } else {
            alert("这个箱子是空的");
            this.color = "#aaa";
        }
    }
}

class Player extends Exit {    

    constructor(_x:number=0, _y:number=0, _ch:string="我", _color="#ff0") {
        super(_x,_y,_ch,_color);
    }

    getSpeed() {
        return 100;
    }
    act() {
        Main.engine.lock();
        document.addEventListener("keydown", this);
    }
    handleEvent(e) {
        
        var code = e.keyCode;

        // Enter
        if (code == ROT.KEYS.VK_SPACE || code == ROT.KEYS.VK_ENTER) {            
            Main.map.enter(this);
            document.removeEventListener("keydown", this);
            Main.engine.unlock();        
            return;
        }

        // Move
        var keyMap = {};
        keyMap[ROT.KEYS.VK_UP] = keyMap[ROT.KEYS.VK_W] = 0;     
        keyMap[ROT.KEYS.VK_RIGHT] = keyMap[ROT.KEYS.VK_D] = 2;      
        keyMap[ROT.KEYS.VK_DOWN] = keyMap[ROT.KEYS.VK_S] = 4;        
        keyMap[ROT.KEYS.VK_LEFT] = keyMap[ROT.KEYS.VK_A] = 6;    
        if (!(code in keyMap)) { return; }

        let dir = ROT.DIRS[8][keyMap[code]];
        let dx = dir[0];
        let dy = dir[1];
        let x = this.x;
        let y = this.y;

        let xx = x + dx;
        let yy = y + dy;

        if (!Main.map.isPassable(xx, yy)) { return; }

        this.x = xx;
        this.y = yy;        
        document.removeEventListener("keydown", this);
        Main.engine.unlock();
        Main.map.draw();
    }
}

class Guard extends Player {
    constructor(_x:number=0, _y:number=0, _ch:string="衛", _color="#f00") {
        super(_x,_y,_ch,_color);
    }
    act() {

        var astar = new ROT.Path.AStar(Main.player.x, Main.player.y, function(x, y) {
            return Main.map.isPassable(x, y); 
        }, {
            topology:4
        });

        var path = [];
        astar.compute(this.x, this.y, function(x, y) {
            path.push([x, y]);
        });
        
        path.shift();
        if (path.length <= 1) {
            Main.engine.lock();
            alert("你被捉住了！");                        
            Main.back_to_title();
        } else {
            this.x = path[0][0];
            this.y = path[0][1];
            Main.map.draw();
        }     
    }
} 