namespace Roguelike {
    /**
     * 转化为RGB 为 HEX
     * @param {string} data 如：rgb(0,0,0)
     */
    function colorHex(colorArr) {
        let strHex = "#";        
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

    export class Tile {
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

    export class Wall extends Tile {
        constructor(_x:number=0, _y:number=0, _ch:string="墻", _color="#fff") {
            super(_x,_y,_ch,_color);
            this.passable = false;
            this.lightpass = false;
        }
    }

    export class Exit extends Tile {
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

    export class Box extends Tile {
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
}