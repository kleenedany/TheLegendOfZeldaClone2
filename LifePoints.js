"use strict";
var LegendofZelda;
(function (LegendofZelda) {
    var f = FudgeCore;
    var fAid = FudgeAid;
    class LifePoints extends fAid.NodeSprite {
        constructor(_name = "LifePoints") {
            super(_name);
            this.addComponent(new f.ComponentTransform());
            this.show(LegendofZelda.ACTION.WAIT);
        }
        static generateSprites(_spritesheet) {
            LifePoints.animations = {};
            let sprite = new fAid.SpriteSheetAnimation(LegendofZelda.ACTION.WAIT, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(0, 0, 14, 13), 1, f.Vector2.ZERO(), 160, f.ORIGIN2D.BOTTOMCENTER);
            LifePoints.animations[LegendofZelda.ACTION.WAIT] = sprite;
        }
        show(_action) {
            this.setAnimation(LifePoints.animations[_action]);
        }
    }
    LegendofZelda.LifePoints = LifePoints;
})(LegendofZelda || (LegendofZelda = {}));
//# sourceMappingURL=LifePoints.js.map