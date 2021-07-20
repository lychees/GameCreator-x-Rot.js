




var Map = (function () {
    function Map(w, h) {
        this.width = w;
        this.height = h;
        this.layer = new Array(w);
        this.shadow = new Array(w);
        for (var x = 0; x < w; ++x) {
            this.layer[x] = new Array(h);
            this.shadow[x] = new Array(h);
            for (var y = 0; y < h; ++y) {
                this.layer[x][y] = new Array();
            }
        }
        this.agents = new Array();
    }
    Map.prototype.enter = function (p) {
        var x = p.x;
        var y = p.y;
        for (var _i = 0, _a = this.layer[x][y]; _i < _a.length; _i++) {
            var t = _a[_i];
            t.enter(p);
        }
    };
    Map.prototype.touch = function (p) {
        var x = p.x;
        var y = p.y;
        for (var _i = 0, _a = this.layer[x][y]; _i < _a.length; _i++) {
            var t = _a[_i];
            t.touch(p);
        }
    };
    Map.prototype.inMap = function (x, y) {
        var w = this.width;
        var h = this.height;
        return 0 <= x && x < w && 0 <= y && y < h;
    };
    Map.prototype.isPassable = function (x, y) {
        if (!this.inMap(x, y))
            return false;
        for (var _i = 0, _a = this.layer[x][y]; _i < _a.length; _i++) {
            var t = _a[_i];
            if (!t.passable)
                return false;
        }
        return true;
    };
    Map.prototype.draw_tile_at = function (x, y) {
        Main.display.draw(x, y, null);
        var a = this.layer[x][y];
        if (a !== null) {
            var n = a.length;
            if (this.shadow[x][y] == true) {
                a[n - 1].draw_with_shadow(0.5);
            }
            else {
                a[n - 1].draw();
            }
        }
    };
    Map.prototype.draw = function () {
        var w = this.width;
        var h = this.height;
        for (var x = 0; x < w; ++x) {
            for (var y = 0; y < h; ++y) {
                this.draw_tile_at(x, y);
            }
        }
        for (var _i = 0, _a = this.agents; _i < _a.length; _i++) {
            var a = _a[_i];
            a.draw();
        }
    };
    Map.prototype.createTileFromSpaces = function (tile, spaces) {
        var pos = spaces.splice(Math.floor(ROT.RNG.getUniform() * spaces.length), 1)[0].split(",");
        var x = parseInt(pos[0]);
        var y = parseInt(pos[1]);
        return new tile(x, y);
    };
    Map.prototype.gen = function (level) {
        var w = this.width;
        var h = this.height;
        var digger;
        if (level == 0) {
            digger = new ROT.Map.EllerMaze(w, h);
        }
        else if (level == 1) {
            digger = new ROT.Map.Digger(w, h);
        }
        else {
            digger = new ROT.Map.Digger(w, h);
        }
        var spaces = [];
        var digCallback = function (x, y, v) {
            if (v) {
                this.layer[x][y].push(new Wall(x, y));
            }
            else {
                this.layer[x][y].push(new Tile(x, y));
                spaces.push(x + "," + y);
            }
        };
        digger.create(digCallback.bind(this));
        var player = this.createTileFromSpaces(Player, spaces);
        this.agents.push(player);
        this.player = player;
        Main.player = player;
        var exit = this.createTileFromSpaces(Exit, spaces);
        this.layer[exit.x][exit.y].push(exit);
        if (level >= 1) {
            for (var i = 0; i < 3; i++) {
                var box = this.createTileFromSpaces(Box, spaces);
                box.hasKey = !i;
                this.layer[box.x][box.y].push(box);
            }
            exit.needKey = true;
            if (level >= 2) {
                var guard = this.createTileFromSpaces(Guard, spaces);
                this.agents.push(guard);
            }
        }
    };
    return Map;
}());
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
    Tile.prototype.enter = function () {
    };
    Tile.prototype.touch = function () {
    };
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
var Exit = (function (_super) {
    __extends(Exit, _super);
    function Exit(_x, _y, _ch, _color) {
        if (_x === void 0) { _x = 0; }
        if (_y === void 0) { _y = 0; }
        if (_ch === void 0) { _ch = "門"; }
        if (_color === void 0) { _color = "#aaf"; }
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
    Box.prototype.enter = function (p) {
        if (this.hasKey == true) {
            alert("你发现了钥匙！");
            this.hasKey = false;
            p.hasKey = true;
            this.color = "#aaa";
        }
        else {
            alert("这个箱子是空的");
            this.color = "#aaa";
        }
    };
    return Box;
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
            Main.map.enter(this);
            document.removeEventListener("keydown", this);
            Main.engine.unlock();
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
        var dx = dir[0];
        var dy = dir[1];
        var x = this.x;
        var y = this.y;
        var xx = x + dx;
        var yy = y + dy;
        if (!Main.map.isPassable(xx, yy)) {
            return;
        }
        this.x = xx;
        this.y = yy;
        document.removeEventListener("keydown", this);
        Main.engine.unlock();
        Main.map.draw();
    };
    return Player;
}(Exit));
var Guard = (function (_super) {
    __extends(Guard, _super);
    function Guard(_x, _y, _ch, _color) {
        if (_x === void 0) { _x = 0; }
        if (_y === void 0) { _y = 0; }
        if (_ch === void 0) { _ch = "衛"; }
        if (_color === void 0) { _color = "#f00"; }
        _super.call(this, _x, _y, _ch, _color);
    }
    Guard.prototype.act = function () {
        var astar = new ROT.Path.AStar(Main.player.x, Main.player.y, function (x, y) {
            return Main.map.isPassable(x, y);
        }, {
            topology: 4
        });
        var path = [];
        astar.compute(this.x, this.y, function (x, y) {
            path.push([x, y]);
        });
        path.shift();
        if (path.length <= 1) {
            Main.engine.lock();
            alert("你被捉住了！");
            Main.back_to_title();
        }
        else {
            this.x = path[0][0];
            this.y = path[0][1];
            Main.map.draw();
        }
    };
    return Guard;
}(Player));
//# sourceMappingURL=map.js.map