
let HEIGHT = 20;
let WIDTH = 34;

var Main = {
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

    start_level: function(level) {
        this.clear_gcCanvas();        
        if (this.level == null) {
            this.init();
        } else {
            // let c = this.display.getContainer();            
            // c.height = 695;
            this.init();
        }
        
        this.map = new Map(WIDTH, HEIGHT);          
        this.level = level;
        this.map.gen(level);
        this.map.draw();
                
        var scheduler = new ROT.Scheduler.Simple();
              
        for (let a of this.map.agents) {
            console.log(a);            
            scheduler.add(a, true);
        }
        /*if (level == 2) {
            this.pedro = this._createBeing(Pedro, freeCells);
            this.pedro.draw();      
            scheduler.add(this.pedro, true);
        }*/
        this.engine = new ROT.Engine(scheduler);
        this.engine.start();
    }
};
