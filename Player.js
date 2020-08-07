"use strict";
var LegendofZelda;
(function (LegendofZelda) {
    var f = FudgeCore;
    var fAid = FudgeAid;
    let ACTION;
    (function (ACTION) {
        ACTION["IDLE"] = "Idle";
        ACTION["WALK"] = "Walk";
        ACTION["WALKSOUTH"] = "WalkSouth";
        ACTION["WALKNORTH"] = "WalkNorth";
        ACTION["SHOOT"] = "Shoot";
        ACTION["WAIT"] = "Wait";
        ACTION["RIGHT_ARROW"] = "FlyRight";
    })(ACTION = LegendofZelda.ACTION || (LegendofZelda.ACTION = {}));
    let DIRECTION;
    (function (DIRECTION) {
        DIRECTION[DIRECTION["LEFT"] = 0] = "LEFT";
        DIRECTION[DIRECTION["RIGHT"] = 1] = "RIGHT";
    })(DIRECTION = LegendofZelda.DIRECTION || (LegendofZelda.DIRECTION = {}));
    class Player extends fAid.NodeSprite {
        constructor(_name) {
            super(_name);
            this.speed = f.Vector3.ZERO();
            this.update = (_event) => {
                let timeFrame = f.Loop.timeFrameGame / 1000;
                let distance = f.Vector3.SCALE(this.speed, timeFrame);
                this.cmpTransform.local.translate(distance);
            };
            this.addComponent(new f.ComponentTransform());
            this.show(ACTION.IDLE);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            this.createLife(3);
        }
        static generateSprites(_spritesheet) {
            Player.animations = {};
            let sprite = new fAid.SpriteSheetAnimation(ACTION.WALK, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(0, 82, 25, 24), 6, f.Vector2.ZERO(), 100, f.ORIGIN2D.BOTTOMCENTER);
            Player.animations[ACTION.WALK] = sprite;
            sprite = new fAid.SpriteSheetAnimation(ACTION.IDLE, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(0, 0, 25, 24), 3, f.Vector2.ZERO(), 100, f.ORIGIN2D.BOTTOMCENTER);
            Player.animations[ACTION.IDLE] = sprite;
            sprite.frames[2].timeScale = 10;
            sprite = new fAid.SpriteSheetAnimation(ACTION.WALKSOUTH, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(0, 0, 25, 24), 7, f.Vector2.ZERO(), 100, f.ORIGIN2D.BOTTOMCENTER);
            Player.animations[ACTION.WALKSOUTH] = sprite;
            sprite = new fAid.SpriteSheetAnimation(ACTION.WALKNORTH, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(0, 25, 25, 24), 7, f.Vector2.ZERO(), 100, f.ORIGIN2D.BOTTOMCENTER);
            Player.animations[ACTION.WALKNORTH] = sprite;
        }
        show(_action) {
            this.setAnimation(Player.animations[_action]);
        }
        act(_action, _direction) {
            let direction;
            switch (_action) {
                case ACTION.IDLE:
                    this.speed.x = 0;
                    this.speed.y = 0;
                    break;
                case ACTION.WALK:
                    direction = (_direction == DIRECTION.RIGHT ? 1 : -1);
                    this.speed.x = Player.speedMax;
                    this.cmpTransform.local.rotation = f.Vector3.Y(90 - 90 * direction);
                    break;
                case ACTION.WALKSOUTH:
                    this.speed.y = Player.speedMax * -1;
                    break;
                case ACTION.WALKNORTH:
                    this.speed.y = Player.speedMax;
                    break;
            }
            if (_action == this.action)
                return;
            this.action = _action;
            this.show(_action);
        }
        createLife(_lifes) {
            let placeHeart = -0.15;
            for (let i = 0; i < _lifes; i++) {
                this.lifePoints = new LegendofZelda.LifePoints();
                this.lifePoints.cmpTransform.local.translateY(0.25);
                this.lifePoints.cmpTransform.local.translateX(placeHeart);
                this.appendChild(this.lifePoints);
                placeHeart = placeHeart + 0.1;
            }
        }
        removeLife(_lifes) {
            let child = this.getChildren();
            for (let i = _lifes; i > 0; i--) {
                this.removeChild(child[0]);
                break;
            }
        }
        getLife() {
            return this.getChildren().length;
        }
        shootArrow() {
            let arrow = new LegendofZelda.Arrow("Arrow");
            arrow.act(ACTION.RIGHT_ARROW);
            this.appendChild(arrow);
        }
    }
    Player.speedMax = 0.8;
    LegendofZelda.Player = Player;
})(LegendofZelda || (LegendofZelda = {}));
//# sourceMappingURL=Player.js.map