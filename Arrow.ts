namespace LegendofZelda {

    import f = FudgeCore;
    import fAid = FudgeAid;

    export class Arrow extends fAid.NodeSprite {
        private static animations: fAid.SpriteSheetAnimations;
        public speed: f.Vector3 = f.Vector3.ZERO();
        private action: ACTION;

        constructor(_name: string) {
            super(_name);
            this.addComponent(new f.ComponentTransform());
            this.show(ACTION.RIGHT_ARROW);
            f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
            this.cmpTransform.local.translateY(0.1);
            console.log("createArrow");
        }

        public static generateSprites(_spritesheet: f.CoatTextured): void {
                Arrow.animations = {};
                let sprite: fAid.SpriteSheetAnimation = new fAid.SpriteSheetAnimation(ACTION.RIGHT_ARROW, _spritesheet);
                sprite.generateByGrid(f.Rectangle.GET(0, 0, 19, 7), 1, f.Vector2.ZERO(), 150, f.ORIGIN2D.BOTTOMCENTER);
                Arrow.animations[ACTION.RIGHT_ARROW] = sprite;
        }

        public show(_action: ACTION): void {
            this.setAnimation(<fAid.SpriteSheetAnimation>Arrow.animations[_action]);
        }

        public act(_action: ACTION): void {
            switch (_action) {
                case ACTION.RIGHT_ARROW:
                    this.speed.x = 1;
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