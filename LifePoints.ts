namespace LegendofZelda {
    import f = FudgeCore;
    import fAid = FudgeAid;


    export class LifePoints extends fAid.NodeSprite {
        private static animations: fAid.SpriteSheetAnimations;

        constructor(_name: string = "LifePoints") {
            super(_name);
            this.addComponent(new f.ComponentTransform());
            this.show(ACTION.WAIT);
        }

        public static generateSprites(_spritesheet: f.CoatTextured): void {
            LifePoints.animations = {};
            let sprite: fAid.SpriteSheetAnimation = new fAid.SpriteSheetAnimation(ACTION.WAIT, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(0, 0, 14, 13), 1, f.Vector2.ZERO(), 160, f.ORIGIN2D.BOTTOMCENTER);
            LifePoints.animations[ACTION.WAIT] = sprite;
        }
        
        public show(_action: ACTION): void {
            this.setAnimation(<fAid.SpriteSheetAnimation>LifePoints.animations[_action]);
        }
    }
}