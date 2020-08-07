namespace LegendofZelda {
    import f = FudgeCore;
    import fAid = FudgeAid;

    export enum ACTION {
        SHOOT_ENEMY = "Shoot"
    }

    export class Shoot extends fAid.NodeSprite {
        private static animations: fAid.SpriteSheetAnimations;

        public speed: f.Vector3 = f.Vector3.ZERO();
        private action: ACTION;

        constructor(_name: string = "Shoot") {
            super(_name);
            this.addComponent(new f.ComponentTransform());
            this.show(ACTION.SHOOT_ENEMY);
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
            console.log("createShoot");
        }

        public static generateSprites(_spritesheet: f.CoatTextured): void {
            Shoot.animations = {};
            let sprite: fAid.SpriteSheetAnimation = new fAid.SpriteSheetAnimation(ACTION.SHOOT_ENEMY, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(0, 0, 6, 6), 1, f.Vector2.ZERO(), 150, f.ORIGIN2D.BOTTOMCENTER);
            Shoot.animations[ACTION.SHOOT_ENEMY] = sprite;
        }

        public show(_action: ACTION): void {
            this.setAnimation(<fAid.SpriteSheetAnimation>Shoot.animations[_action]);
        }
        
        public act(_action: ACTION): void {

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

        private update = (_event: f.Eventƒ): void => {
            let timeFrame: number = f.Loop.timeFrameGame / 1000;
            let distance: f.Vector3 = f.Vector3.SCALE(this.speed, timeFrame);
            this.cmpTransform.local.translate(distance);
        }
    }
}