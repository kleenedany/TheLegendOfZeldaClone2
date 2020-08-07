namespace LegendofZelda {
    import f = FudgeCore;
    import fAid = FudgeAid;


    export class Endboss extends fAid.NodeSprite {
        private static animations: fAid.SpriteSheetAnimations;

        constructor(_name: string = "Endboss") {
            super(_name);
            this.addComponent(new f.ComponentTransform());
            this.show(ACTION.WAIT);
        }

        public static generateSprites(_spritesheet: f.CoatTextured): void {
            Endboss.animations = {};
            let sprite: fAid.SpriteSheetAnimation = new fAid.SpriteSheetAnimation(ACTION.WAIT, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(0, 0, 16, 18), 2, f.Vector2.ZERO(), 40, f.ORIGIN2D.BOTTOMCENTER);
            Endboss.animations[ACTION.WAIT] = sprite;
        }
        
        public show(_action: ACTION): void {
            this.setAnimation(<fAid.SpriteSheetAnimation>Endboss.animations[_action]);
        }

        public shootBoss(): void {
            let shoot: Shoot = new Shoot();
            shoot.act(ACTION.SHOOT_ENEMY);
            this.appendChild(shoot);
        }

    }

}