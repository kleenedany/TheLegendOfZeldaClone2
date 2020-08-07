"use strict";
var LegendofZelda;
(function (LegendofZelda) {
    var f = FudgeCore;
    var fAid = FudgeAid;
    class Endboss extends fAid.NodeSprite {
        constructor(_name = "Endboss") {
            super(_name);
            this.addComponent(new f.ComponentTransform());
            this.show(LegendofZelda.ACTION.WAIT);
        }
        static generateSprites(_spritesheet) {
            Endboss.animations = {};
            let sprite = new fAid.SpriteSheetAnimation(LegendofZelda.ACTION.WAIT, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(0, 0, 16, 18), 2, f.Vector2.ZERO(), 40, f.ORIGIN2D.BOTTOMCENTER);
            Endboss.animations[LegendofZelda.ACTION.WAIT] = sprite;
        }
        show(_action) {
            this.setAnimation(Endboss.animations[_action]);
        }
        shootBoss() {
            let shoot = new LegendofZelda.Shoot();
            shoot.act(LegendofZelda.ACTION.SHOOT_ENEMY);
            this.appendChild(shoot);
        }
    }
    LegendofZelda.Endboss = Endboss;
})(LegendofZelda || (LegendofZelda = {}));
//# sourceMappingURL=Endboss.js.map