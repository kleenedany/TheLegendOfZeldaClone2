"use strict";
var LegendofZelda;
(function (LegendofZelda) {
    var f = FudgeCore;
    var fAid = FudgeAid;
    let ACTION;
    (function (ACTION) {
        ACTION["SHOOT_ENEMY"] = "Shoot";
    })(ACTION = LegendofZelda.ACTION || (LegendofZelda.ACTION = {}));
    class Shoot extends fAid.NodeSprite {
        constructor(_name = "Shoot") {
            super(_name);
            this.speed = f.Vector3.ZERO();
            this.update = (_event) => {
                let timeFrame = f.Loop.timeFrameGame / 1000;
                let distance = f.Vector3.SCALE(this.speed, timeFrame);
                this.cmpTransform.local.translate(distance);
            };
            this.addComponent(new f.ComponentTransform());
            this.show(ACTION.SHOOT_ENEMY);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            console.log("createShoot");
        }
        static generateSprites(_spritesheet) {
            Shoot.animations = {};
            let sprite = new fAid.SpriteSheetAnimation(ACTION.SHOOT_ENEMY, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(0, 0, 6, 6), 1, f.Vector2.ZERO(), 150, f.ORIGIN2D.BOTTOMCENTER);
            Shoot.animations[ACTION.SHOOT_ENEMY] = sprite;
        }
        show(_action) {
            this.setAnimation(Shoot.animations[_action]);
        }
        act(_action) {
            switch (_action) {
                case ACTION.SHOOT_ENEMY:
                    this.speed.x = -0.3;
                    break;
            }
            if (_action == this.action)
                return;
            this.action = _action;
            this.show(_action);
        }
    }
    LegendofZelda.Shoot = Shoot;
})(LegendofZelda || (LegendofZelda = {}));
//# sourceMappingURL=Shoot.js.map