
let HEIGHT = 20;
let WIDTH = 34;

var Main = {
    display: null,
    map: {},    
    engine: null,
    level: null,
    player: null,
    exit: null,
    pedro: null,

    // 返回主菜单
    back_to_title: function() {
        document.removeEventListener("keydown", Main.player);        
        document.body.removeChild(this.display.getContainer());
        var c = document.getElementById("gcCanvas");        
        c.height = 695;
    }

    // 清空 gcCanvas
    clear_gcCanvas: function() {
        let c = document.getElementById("gcCanvas");          
        c.height = 0;
    }
    
    init: function() {        
    
        this.display = new ROT.Display({
            width: 100,
            height: 100,
            fontSize: 26,
            spacing: 1.08,
            fontFamily: 'Verdana' //Arial //'sans-serif',
        });

        document.body.appendChild(this.display.getContainer());
    },

    // 导出地图
    export_map: function() {
            text = String.raw`{"autoplayBgm":false,"autoplayBgs":false,"battleback1Name":"","battleback2Name":"","bgm":{"name":"","pan":0,"pitch":100,"volume":90},"bgs":{"name":"","pan":0,"pitch":100,"volume":90},"disableDashing":false,"displayName":"随机地牢","encounterList":[],"encounterStep":999,            "height":`+HEIGHT+String.raw`,"note":"","parallaxLoopX":false,"parallaxLoopY":false,"parallaxName":"","parallaxShow":true,"parallaxSx":0,"parallaxSy":0,"scrollType":0,"specifyBattleback":false,"tilesetId":8,"width":`+WIDTH+`,`;        
            event = String.raw`"events":[]}`;
            data = String.raw`"data":[`;
            
            let data_array = [];
            for (let l=0;l<6;++l) {
                for (let i=0;i<HEIGHT;++i) {
                    for (let j=0;j<WIDTH;++j) {
                        if (l > 0) {
                            data_array.push(0);
                        } else {
                            var key = i+","+j;
                            if (this.map[key] == "墻") {
                                data_array.push(1536);
                            } else {
                                data_array.push(1568);
                            }
                        }                        
                    }
                }
            }
            data += String(data_array) + '],';
            console.log(text+data+event);
    },

    start_level: function(level) {

        this.clear_gcCanvas();        
        if (this.level == null) {
            this.init();
        } else {
            // let c = this.display.getContainer();            
            // c.height = 695;
            this.init();
        }

        this.map = {}

        this.level = level;
        let digger;
        if (level == 0) {
            digger = new ROT.Map.EllerMaze(WIDTH, HEIGHT);
        } else if (level == 1) {
            digger = new ROT.Map.Digger(WIDTH, HEIGHT);
        } else {
            digger = new ROT.Map.Digger(WIDTH, HEIGHT);
        }

        var freeCells = [];
        
        var digCallback = function(x, y, value) {
            if (value) {
                var key = x+","+y;
                this.map[key] = new Wall(x, y);
            } else {
                var key = x+","+y;
                this.map[key] = new Tile(x, y);
                freeCells.push(key);
            }
        }
        digger.create(digCallback.bind(this));
                    
        this.exit = this._createBeing(Exit, freeCells);        
        this.map[this.exit.x+','+this.exit.y] = this.exit;
        if (level >= 1) {
            this._generateBoxes(freeCells);
            this.exit.needKey = true;
        }        
        this._drawWholeMap();

        this.player = this._createBeing(Player, freeCells);
        this.player.draw();                
        
        var scheduler = new ROT.Scheduler.Simple();
        scheduler.add(this.player, true);
        if (level == 2) {
            this.pedro = this._createBeing(Pedro, freeCells);
            this.pedro.draw();      
            scheduler.add(this.pedro, true);
        }
        this.engine = new ROT.Engine(scheduler);
        this.engine.start();
    }
    
    _createBeing: function(what, freeCells) {
        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        var key = freeCells.splice(index, 1)[0];
        var parts = key.split(",");
        var x = parseInt(parts[0]);
        var y = parseInt(parts[1]);        
        return new what(x, y);
    },
    
    _generateBoxes: function(freeCells) {
        for (var i=0;i<3;i++) {
            var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
            var key = freeCells.splice(index, 1)[0];
            var parts = key.split(",");
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            this.map[key] = new Box(x, y);
            if (!i) { this.map[key].hasKey = true; }
        }
    },
    
    _drawWholeMap: function() {
        for (var key in this.map) {
            var parts = key.split(",");
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            this.map[key].draw();
        }
    }
};

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

class Box extends Tile {
    hasKey: boolean;
    constructor(_x:number=0, _y:number=0, _ch:string="箱", _color="#ffa") {
        super(_x,_y,_ch,_color);
        this.hasKey = false;        
    }
    enter(who: any) {
        if (this.hasKey == true) {
            alert("你发现了钥匙！");
            this.hasKey = false;
            who.hasKey = true;
            this.color = "#aaa";
        } else {
            alert("这个箱子是空的");
            this.color = "#aaa";
        }
    }
}

class Exit extends Tile {
    x: number;
    y: number;
    needKey: boolean;
    constructor(_x:number=0, _y:number=0, _ch:string="門", _color="#eef") {
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
                
        // Enter evnet
        if (code == ROT.KEYS.VK_SPACE || code == ROT.KEYS.VK_ENTER) {
            Main.map[this.x+","+this.y].enter(this);        
            return;
        }

        // Move
        var keyMap = {};
        keyMap[ROT.KEYS.VK_UP] = keyMap[ROT.KEYS.VK_W] = 0;     
        keyMap[ROT.KEYS.VK_RIGHT] = keyMap[ROT.KEYS.VK_D] = 2;      
        keyMap[ROT.KEYS.VK_DOWN] = keyMap[ROT.KEYS.VK_S] = 4;        
        keyMap[ROT.KEYS.VK_LEFT] = keyMap[ROT.KEYS.VK_A] = 6;    
        if (!(code in keyMap)) { return; }

        var dir = ROT.DIRS[8][keyMap[code]];
        var newX = this.x + dir[0];
        var newY = this.y + dir[1];
        var newKey = newX + "," + newY;    
        if (!(newKey in Main.map) || (Main.map[newKey].passable == false)) { return; }

        Main.map[this.x+','+this.y].draw();
        this.x = newX;
        this.y = newY;
        this.draw();
        
        document.removeEventListener("keydown", this);
        Main.engine.unlock(); 
    }
}
    
class Pedro extends Player {
    constructor(_x:number=0, _y:number=0, _ch:string="衛", _color="#f00") {
        super(_x,_y,_ch,_color);
    }    
    act() {
        var x = Main.player.x;
        var y = Main.player.y;

        var passableCallback = function(x, y) {
            let p = x+','+y;
            return ((p in Main.map) && Main.map[p].passable);
        }
        var astar = new ROT.Path.AStar(x, y, passableCallback, {topology:4});

        var path = [];
        var pathCallback = function(x, y) {
            path.push([x, y]);
        }
        astar.compute(this.x, this.y, pathCallback);

        path.shift();
        if (path.length <= 1) {
            Main.engine.lock();
            alert("你被捉住了！");                        
            Main.back_to_title();
        } else {
            x = path[0][0];
            y = path[0][1];
            Main.map[this.x+","+this.y].draw();
            this.x = x;
            this.y = y;
            this.draw();
        }       
    }
}