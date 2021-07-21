var Roguelike;
(function (Roguelike) {
    Roguelike.Main = {
        display: null,
        map: null,
        engine: null,
        level: null,
        player: null,
        exit: null,
        pedro: null,
        back_to_title: function () {
            document.removeEventListener("keydown", Roguelike.Main.player);
            document.body.removeChild(this.display.getContainer());
            GameUI.show(1);
        },
        init: function () {
            this.display = new ROT.Display({
                width: 100,
                height: 100,
                fontSize: 26,
                spacing: 1.08,
                fontFamily: 'Verdana'
            });
            document.body.insertBefore(this.display.getContainer(), document.getElementById('the3Container'));
            document.getElementById("gcCanvas").style.position = "relative";
        },
        start_level: function () {
            var ui1 = GameUI.get(1);
            var w = ui1.width.text;
            var h = ui1.height.text;
            GameUI.hideAll();
            if (this.level == null) {
                this.init();
            }
            this.level = 1;
            this.map = new Roguelike.Map(w, h);
            this.map.gen();
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
})(Roguelike || (Roguelike = {}));
//# sourceMappingURL=Main.js.map