namespace LegendofZelda{
    import f = FudgeCore;
    import fAid = FudgeAid;

    export enum ACTION {
        IDLE = "Idle",
        WALK = "Walk",
        WALKSOUTH = "WalkSouth",
        WALKNORTH= "WalkNorth",
        SHOOT = "Shoot",
        WAIT = "Wait",
        RIGHT_ARROW = "FlyRight"
    }

    export enum DIRECTION {
        LEFT, RIGHT
    }
    export class Player extends fAid.NodeSprite {
        private static animations: fAid.SpriteSheetAnimations;
        private static speedMax: number = 0.8;
        public speed: f.Vector3 = f.Vector3.ZERO();
        private action: ACTION;
        private lifePoints: LifePoints;

        constructor(_name: string) {
            super(_name);
            this.addComponent(new f.ComponentTransform());
            this.show(ACTION.IDLE);
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
            this.createLife(3);
        }

        public static generateSprites(_spritesheet: f.CoatTextured): void {
            Player.animations = {};
            let sprite: fAid.SpriteSheetAnimation = new fAid.SpriteSheetAnimation(ACTION.WALK, _spritesheet);
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

        public show(_action: ACTION): void {
            this.setAnimation(<fAid.SpriteSheetAnimation>Player.animations[_action]);
        }

        public act(_action: ACTION, _direction?: DIRECTION): void {
            let direction: number;
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

        public createLife(_lifes: number): void {
            let placeHeart: number = -0.15;

            for (let i: number = 0; i < _lifes; i ++) {
                this.lifePoints = new LifePoints();
                this.lifePoints.cmpTransform.local.translateY(0.25);
                this.lifePoints.cmpTransform.local.translateX(placeHeart);
                this.appendChild(this.lifePoints);
                placeHeart = placeHeart + 0.1;
            }   
        }

        public removeLife(_lifes: number): void {
            let child = this.getChildren();
            for (let i: number = _lifes; i > 0; i -- ) { 
                    this.removeChild(child[0]);
                    break;
            }
        }

        public getLife(): number {
            return this.getChildren().length;
        }

        public shootArrow(): void {
            let arrow: Arrow = new Arrow("Arrow");
            arrow.act(ACTION.RIGHT_ARROW);
            this.appendChild(arrow);
        }

        private update = (_event: f.Eventƒ): void => {
            let timeFrame: number = f.Loop.timeFrameGame / 1000;
            let distance: f.Vector3 = f.Vector3.SCALE(this.speed, timeFrame);
            this.cmpTransform.local.translate(distance);
        }
    }
}