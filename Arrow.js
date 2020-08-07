"use strict";
var LegendofZelda;
(function (LegendofZelda) {
    var f = FudgeCore;
    var fAid = FudgeAid;
    class Arrow extends fAid.NodeSprite {
        constructor(_name) {
            super(_name);
            this.speed = f.Vector3.ZERO();
            this.update = (_event) => {
                let timeFrame = f.Loop.timeFrameGame / 1000;
                let distance = f.Vector3.SCALE(this.speed, timeFrame);
                this.cmpTransform.local.translate(distance);
            };
            this.addComponent(new f.ComponentTransform());
            this.show(LegendofZelda.ACTION.RIGHT_ARROW);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            this.cmpTransform.local.translateY(0.1);
            console.log("createArrow");
        }
        static generateSprites(_spritesheet) {
            Arrow.animations = {};
            let sprite = new fAid.SpriteSheetAnimation(LegendofZelda.ACTION.RIGHT_ARROW, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(0, 0, 19, 7), 1, f.Vector2.ZERO(), 150, f.ORIGIN2D.BOTTOMCENTER);
            Arrow.animations[LegendofZelda.ACTION.RIGHT_ARROW] = sprite;
        }
        show(_action) {
            this.setAnimation(Arrow.animations[_action]);
        }
        act(_action) {
            switch (_action) {
                case LegendofZelda.ACTION.RIGHT_ARROW:
                    this.speed.x = 1;
                    break;
            }
            if (_action == this.action)
                return;
            this.action = _action;
            this.show(_action);
        }
    }
    LegendofZelda.Arrow = Arrow;
})(LegendofZelda || (LegendofZelda = {}));
//# sourceMappingURL=Arrow.js.map