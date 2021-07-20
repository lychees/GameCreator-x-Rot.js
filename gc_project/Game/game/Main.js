var Main = {
    display: null,
    map: null,
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
    start_level: function (level) {
        var ui1 = GameUI.get(1);
        var w = ui1.width.text;
        var h = ui1.height.text;
        this.clear_gcCanvas();
        if (this.level == null) {
            this.init();
        }
        else {
            this.init();
        }
        this.map = new Map(w, h);
        this.level = level;
        this.map.gen(level);
        this.map.draw();
        var scheduler = new ROT.Scheduler.Simple();
        for (var _i = 0, _a = this.map.agents; _i < _a.length; _i++) {
            var a = _a[_i];
            console.log(a);
            scheduler.add(a, true);
        }
        this.engine = new ROT.Engine(scheduler);
        this.engine.start();
    }
};
//# sourceMappingURL=Main.js.map