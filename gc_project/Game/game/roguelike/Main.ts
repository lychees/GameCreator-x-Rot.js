namespace Roguelike {
    export var Main = {
        display: null,
        map: null,
        engine: null,
        level: null,
        player: null,
        exit: null,
        pedro: null,

        // 返回主菜单
        back_to_title: function() {
            document.removeEventListener("keydown", Main.player);        
            document.body.removeChild(this.display.getContainer());        
            GameUI.show(1);
        },
        
        init: function() {
            this.display = new ROT.Display({
                width: 100,
                height: 100,
                fontSize: 26,
                spacing: 1.08,
                fontFamily: 'Verdana' //Arial //'sans-serif',
            });

            document.body.insertBefore(this.display.getContainer(), document.getElementById('the3Container'));
            document.getElementById("gcCanvas").style.position = "relative";       
        },

        start_level: function() {

            let ui1 = GameUI.get(1);
            let w = ui1.width.text;
            let h = ui1.height.text;

            GameUI.hideAll();      
            if (this.level == null) {
                this.init();
            }
            this.level = 1;
            this.map = new Map(w, h);                      
            this.map.gen();
            this.map.draw();
                    
            var scheduler = new ROT.Scheduler.Simple();
                
            for (let a of this.map.agents) {
                console.log(a);            
                scheduler.add(a, true);
            }

            this.engine = new ROT.Engine(scheduler);
            this.engine.start();
        }
    };
}
