"use strict";
var LegendofZelda;
(function (LegendofZelda) {
    var f = FudgeCore;
    var fAid = FudgeAid;
    class Enemy extends fAid.NodeSprite {
        constructor(_name) {
            super(_name);
            this.addComponent(new f.ComponentTransform());
            this.show(LegendofZelda.ACTION.WAIT);
        }
        static generateSprites(_spritesheet) {
            Enemy.animations = {};
            let sprite = new fAid.SpriteSheetAnimation(LegendofZelda.ACTION.WAIT, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(0, 80, 25, 24), 2, f.Vector2.ZERO(), 100, f.ORIGIN2D.BOTTOMCENTER);
            Enemy.animations[LegendofZelda.ACTION.WAIT] = sprite;
        }
        show(_action) {
            this.setAnimation(Enemy.animations[_action]);
        }
        shootEnemy() {
            let shoot = new LegendofZelda.Shoot();
            shoot.act(LegendofZelda.ACTION.SHOOT_ENEMY);
            this.appendChild(shoot);
        }
    }
    LegendofZelda.Enemy = Enemy;
})(LegendofZelda || (LegendofZelda = {}));
//# sourceMappingURL=Enemy.js.map