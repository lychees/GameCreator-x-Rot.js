




var HEIGHT = 20;
var WIDTH = 34;
var Main = {
    display: null,
    map: {},
    engine: null,
    level: null,
    player: null,
    exit: null,
    pedro: null,
    back_to_title: function () {
        document.removeEventListener("keydown", Main.player);
        document.body.removeChild(this.display.getContainer());
        var c = document.getElementById("gcCanvas");
        c.height = 695;
    },
    clear_gcCanvas: function () {
        var c = document.getElementById("gcCanvas");
        c.height = 0;
    },
    init: function () {
        this.display = new ROT.Display({
            width: 100,
            height: 100,
            fontSize: 26,
            spacing: 1.08,
            fontFamily: 'Verdana'
        });
        document.body.appendChild(this.display.getContainer());
    },
    export_map: function () {
        text = (_a = ["{\"autoplayBgm\":false,\"autoplayBgs\":false,\"battleback1Name\":\"\",\"battleback2Name\":\"\",\"bgm\":{\"name\":\"\",\"pan\":0,\"pitch\":100,\"volume\":90},\"bgs\":{\"name\":\"\",\"pan\":0,\"pitch\":100,\"volume\":90},\"disableDashing\":false,\"displayName\":\"\u968F\u673A\u5730\u7262\",\"encounterList\":[],\"encounterStep\":999,            \"height\":"], _a.raw = ["{\"autoplayBgm\":false,\"autoplayBgs\":false,\"battleback1Name\":\"\",\"battleback2Name\":\"\",\"bgm\":{\"name\":\"\",\"pan\":0,\"pitch\":100,\"volume\":90},\"bgs\":{\"name\":\"\",\"pan\":0,\"pitch\":100,\"volume\":90},\"disableDashing\":false,\"displayName\":\"随机地牢\",\"encounterList\":[],\"encounterStep\":999,            \"height\":"], String.raw(_a)) + HEIGHT + (_b = [",\"note\":\"\",\"parallaxLoopX\":false,\"parallaxLoopY\":false,\"parallaxName\":\"\",\"parallaxShow\":true,\"parallaxSx\":0,\"parallaxSy\":0,\"scrollType\":0,\"specifyBattleback\":false,\"tilesetId\":8,\"width\":"], _b.raw = [",\"note\":\"\",\"parallaxLoopX\":false,\"parallaxLoopY\":false,\"parallaxName\":\"\",\"parallaxShow\":true,\"parallaxSx\":0,\"parallaxSy\":0,\"scrollType\":0,\"specifyBattleback\":false,\"tilesetId\":8,\"width\":"], String.raw(_b)) + WIDTH + ",";
        event = (_c = ["\"events\":[]}"], _c.raw = ["\"events\":[]}"], String.raw(_c));
        data = (_d = ["\"data\":["], _d.raw = ["\"data\":["], String.raw(_d));
        var data_array = [];
        for (var l = 0; l < 6; ++l) {
            for (var i = 0; i < HEIGHT; ++i) {
                for (var j = 0; j < WIDTH; ++j) {
                    if (l > 0) {
                        data_array.push(0);
                    }
                    else {
                        var key = i + "," + j;
                        if (this.map[key] == "墻") {
                            data_array.push(1536);
                        }
                        else {
                            data_array.push(1568);
                        }
                    }
                }
            }
        }
        data += String(data_array) + '],';
        console.log(text + data + event);
        var _a, _b, _c, _d;
    },
    start_level: function (level) {
        this.clear_gcCanvas();
        if (this.level == null) {
            this.init();
        }
        else {
            this.init();
        }
        this.map = {};
        this.level = level;
        var digger;
        if (level == 0) {
            digger = new ROT.Map.EllerMaze(WIDTH, HEIGHT);
        }
        else if (level == 1) {
            digger = new ROT.Map.Digger(WIDTH, HEIGHT);
        }
        else {
            digger = new ROT.Map.Digger(WIDTH, HEIGHT);
        }
        var freeCells = [];
        var digCallback = function (x, y, value) {
            if (value) {
                var key = x + "," + y;
                this.map[key] = new Wall(x, y);
            }
            else {
                var key = x + "," + y;
                this.map[key] = new Tile(x, y);
                freeCells.push(key);
            }
        };
        digger.create(digCallback.bind(this));
        this.exit = this._createBeing(Exit, freeCells);
        this.map[this.exit.x + ',' + this.exit.y] = this.exit;
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
    },
    _createBeing: function (what, freeCells) {
        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        var key = freeCells.splice(index, 1)[0];
        var parts = key.split(",");
        var x = parseInt(parts[0]);
        var y = parseInt(parts[1]);
        return new what(x, y);
    },
    _generateBoxes: function (freeCells) {
        for (var i = 0; i < 3; i++) {
            var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
            var key = freeCells.splice(index, 1)[0];
            var parts = key.split(",");
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            this.map[key] = new Box(x, y);
            if (!i) {
                this.map[key].hasKey = true;
            }
        }
    },
    _drawWholeMap: function () {
        for (var key in this.map) {
            var parts = key.split(",");
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            this.map[key].draw();
        }
    }
};
var Tile = (function () {
    function Tile(_x, _y, _ch, _color) {
        if (_x === void 0) { _x = 0; }
        if (_y === void 0) { _y = 0; }
        if (_ch === void 0) { _ch = "  "; }
        if (_color === void 0) { _color = "#fff"; }
        this.x = _x;
        this.y = _y;
        this.ch = _ch;
        this.color = _color;
        this.passable = true;
    }
    Tile.prototype.draw = function () {
        Main.display.draw(this.x, this.y, this.ch, this.color);
    };
    return Tile;
}());
var Wall = (function (_super) {
    __extends(Wall, _super);
    function Wall(_x, _y, _ch, _color) {
        if (_x === void 0) { _x = 0; }
        if (_y === void 0) { _y = 0; }
        if (_ch === void 0) { _ch = "墻"; }
        if (_color === void 0) { _color = "#fff"; }
        _super.call(this, _x, _y, _ch, _color);
        this.passable = false;
    }
    return Wall;
}(Tile));
var Box = (function (_super) {
    __extends(Box, _super);
    function Box(_x, _y, _ch, _color) {
        if (_x === void 0) { _x = 0; }
        if (_y === void 0) { _y = 0; }
        if (_ch === void 0) { _ch = "箱"; }
        if (_color === void 0) { _color = "#ffa"; }
        _super.call(this, _x, _y, _ch, _color);
        this.hasKey = false;
    }
    Box.prototype.enter = function (who) {
        if (this.hasKey == true) {
            alert("你发现了钥匙！");
            this.hasKey = false;
            who.hasKey = true;
            this.color = "#aaa";
        }
        else {
            alert("这个箱子是空的");
            this.color = "#aaa";
        }
    };
    return Box;
}(Tile));
var Exit = (function (_super) {
    __extends(Exit, _super);
    function Exit(_x, _y, _ch, _color) {
        if (_x === void 0) { _x = 0; }
        if (_y === void 0) { _y = 0; }
        if (_ch === void 0) { _ch = "門"; }
        if (_color === void 0) { _color = "#eef"; }
        _super.call(this, _x, _y, _ch, _color);
        this.needKey = false;
    }
    Exit.prototype.enter = function (who) {
        if (!this.needKey || who.hasKey) {
            alert("你找到了出口!");
            Main.engine.lock();
            Main.back_to_title();
        }
        else {
            alert("锁上了!");
        }
    };
    return Exit;
}(Tile));
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(_x, _y, _ch, _color) {
        if (_x === void 0) { _x = 0; }
        if (_y === void 0) { _y = 0; }
        if (_ch === void 0) { _ch = "我"; }
        if (_color === void 0) { _color = "#ff0"; }
        _super.call(this, _x, _y, _ch, _color);
    }
    Player.prototype.getSpeed = function () {
        return 100;
    };
    Player.prototype.act = function () {
        Main.engine.lock();
        document.addEventListener("keydown", this);
    };
    Player.prototype.handleEvent = function (e) {
        var code = e.keyCode;
        if (code == ROT.KEYS.VK_SPACE || code == ROT.KEYS.VK_ENTER) {
            Main.map[this.x + "," + this.y].enter(this);
            return;
        }
        var keyMap = {};
        keyMap[ROT.KEYS.VK_UP] = keyMap[ROT.KEYS.VK_W] = 0;
        keyMap[ROT.KEYS.VK_RIGHT] = keyMap[ROT.KEYS.VK_D] = 2;
        keyMap[ROT.KEYS.VK_DOWN] = keyMap[ROT.KEYS.VK_S] = 4;
        keyMap[ROT.KEYS.VK_LEFT] = keyMap[ROT.KEYS.VK_A] = 6;
        if (!(code in keyMap)) {
            return;
        }
        var dir = ROT.DIRS[8][keyMap[code]];
        var newX = this.x + dir[0];
        var newY = this.y + dir[1];
        var newKey = newX + "," + newY;
        if (!(newKey in Main.map) || (Main.map[newKey].passable == false)) {
            return;
        }
        Main.map[this.x + ',' + this.y].draw();
        this.x = newX;
        this.y = newY;
        this.draw();
        document.removeEventListener("keydown", this);
        Main.engine.unlock();
    };
    return Player;
}(Exit));
var Pedro = (function (_super) {
    __extends(Pedro, _super);
    function Pedro(_x, _y, _ch, _color) {
        if (_x === void 0) { _x = 0; }
        if (_y === void 0) { _y = 0; }
        if (_ch === void 0) { _ch = "衛"; }
        if (_color === void 0) { _color = "#f00"; }
        _super.call(this, _x, _y, _ch, _color);
    }
    Pedro.prototype.act = function () {
        var x = Main.player.x;
        var y = Main.player.y;
        var passableCallback = function (x, y) {
            var p = x + ',' + y;
            return ((p in Main.map) && Main.map[p].passable);
        };
        var astar = new ROT.Path.AStar(x, y, passableCallback, { topology: 4 });
        var path = [];
        var pathCallback = function (x, y) {
            path.push([x, y]);
        };
        astar.compute(this.x, this.y, pathCallback);
        path.shift();
        if (path.length <= 1) {
            Main.engine.lock();
            alert("你被捉住了！");
            Main.back_to_title();
        }
        else {
            x = path[0][0];
            y = path[0][1];
            Main.map[this.x + "," + this.y].draw();
            this.x = x;
            this.y = y;
            this.draw();
        }
    };
    return Pedro;
}(Player));
//# sourceMappingURL=Main.js.map