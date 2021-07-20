
class Map {
    
    width: number;
    height: number;
    name: string;

    layer: any[][][];
    shadow: number[][];
    agents: any[];
    player: any;

    isFov: boolean;

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
                this.shadow[x][y] = 1;
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
    // 光线检测
    canLightPass(x: number, y:number): boolean {
        if (!this.inMap(x, y)) return false;            
        for (let t of this.layer[x][y]) {     
            if (!t.lightpass) return false; 
        }
        return true;  
    }

    // 画某个位置的地块
    draw_tile_at(x: number, y:number) {
        Main.display.draw(x, y, null);
        let a = this.layer[x][y];
        if (a !== null) {            
            let n = a.length;
            if (this.shadow[x][y] !== 0 && this.isFov) {
                a[n-1].draw_with_shadow(this.shadow[x][y]);
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
        player.set_shadow(0.5, 360);
        player.set_shadow();

        // 生成出口
        let exit = this.createTileFromSpaces(Exit, spaces);
        this.layer[exit.x][exit.y].push(exit);        
        // 生成箱子与钥匙        

        let ui1 = GameUI.get(1);        
        this.isFov = !ui1.isFov.selected;
        let isBox = ui1.isBox.selected;
        let isGuard = ui1.isGuard.selected;
        
        if (isBox) {
            for (var i=0;i<3;i++) {
                let box = this.createTileFromSpaces(Box, spaces);                
                box.hasKey = !i;
                this.layer[box.x][box.y].push(box);
            }
            exit.needKey = true;
        }                    
        if (isGuard) {
            let guard = this.createTileFromSpaces(Guard, spaces);  
            this.agents.push(guard);
        }
    }
}


// 地块

/**
     * 转化为RGB 为 HEX
     * @param {string} data 如：rgb(0,0,0)
     */
function colorHex(colorArr) {
    let strHex = "#" 
    let colorArr
    // 转成16进制 
    for (let i = 0; i < colorArr.length; i++) {
        let hex = Number(colorArr[i]).toString(16);
        if (hex.length == "1") { hex = "0" + hex; }
        strHex += hex;
    }
    return strHex;
}

/**
 * 转化为HEX 为RGB
 * @param {string} data 如：#ffffff、#fff
 */
function colorRgb(data) {
    // 16进制颜色值的正则 
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 把颜色值变成小写 
    let color = data.toLowerCase();
    if (reg.test(color)) {
        // 如果只有三位的值，需变成六位，如：#fff => #ffffff 
        if (color.length === 4) {
            let colorNew = "#";
            for (let i = 1; i < 4; i += 1) {
                colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
            }
            color = colorNew;
        }
        // 处理六位的颜色值，转为RGB 
        let colorChange = [];
        for (let i = 1; i < 7; i += 2) {
            colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
        }
        return colorChange;
    } else { return color; }
}

function mix(data: string, shadow: number) {
    let c = colorRgb(data);
    for (let i=0;i<c.length;++i) {
        c[i] = Math.floor(c[i] * (1 - shadow));
    }
    return colorHex(c);
}

class Tile {
    x: number;
    y: number;
    ch: string;
    color: string;
    passable: boolean;
    lightpass: boolean;

    constructor(_x:number=0, _y:number=0, _ch:string="  ", _color="#fff") {
        this.x = _x;
        this.y = _y;
        this.ch = _ch;
        this.color = _color;  
        this.passable = true;
        this.lightpass = true;
    }
    enter() {
    }
    touch() {        
    }
    draw() {
        Main.display.draw(this.x, this.y, this.ch, this.color);
    }
    draw_with_shadow(shadow: number) {
        Main.display.draw(this.x, this.y, this.ch, mix(this.color, shadow));
    }
}

class Wall extends Tile {
    constructor(_x:number=0, _y:number=0, _ch:string="墻", _color="#fff") {
        super(_x,_y,_ch,_color);
        this.passable = false;
        this.lightpass = false;
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

class Creature extends Tile {
    d: number; // direction  
    fv: number; // field_of_vision

    hp: number; HP: number;
    mp: number; MP: number;
    sp: number; SP: number;

    str: number; dex: number; con: number;
    int: number; wis: number; cha: number;

    constructor(_x:number=0, _y:number=0, _ch:string="c", _color="#fff") {
        super(_x,_y,_ch,_color);
        this.d = 0; this.fv = 6; 
        
        this.hp = 0; this.HP = 0;
        this.mp = 0; this.MP = 0;
        this.sp = 0; this.SP = 0;

        this.str = 0; this.dex = 0; this.con = 0;
        this.int = 0; this.wis = 0; this.cha = 0;
    }

    getSpeed() {
        return 100;
    }
   
    set_shadow(s:number=0, angle:number=90) {
        var fov = new ROT.FOV.RecursiveShadowcasting(function(x, y) {
            return Main.map.canLightPass(x, y); 
        });
        if (angle == 90) {
            fov.compute90(this.x, this.y, this.fv, this.d, function(x, y, r, visibility) {
                Main.map.shadow[x][y] = s;
            });
        } else {
            fov.compute(this.x, this.y, this.fv, function(x, y, r, visibility) {
                Main.map.shadow[x][y] = s;
            });
        }
    }
}

class Player extends Creature {

    constructor(_x:number=0, _y:number=0, _ch:string="我", _color="#ff0") {
        super(_x,_y,_ch,_color);
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
        
        let d = keyMap[code];        
        let dx = ROT.DIRS[8][d][0];
        let dy = ROT.DIRS[8][d][1];
        let x = this.x;
        let y = this.y;

        let xx = x + dx;
        let yy = y + dy;

        this.set_shadow(0.5);
        this.d = d;
    
        if (Main.map.isPassable(xx, yy)) {                    
            this.x = xx;
            this.y = yy;
        }

        this.set_shadow();
        Main.map.draw();
        document.removeEventListener("keydown", this);
        Main.engine.unlock();         
    }
}

class Guard extends Creature {
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