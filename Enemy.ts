namespace LegendofZelda {
    import f = FudgeCore;
    import fAid = FudgeAid;


    export class Enemy extends fAid.NodeSprite {
        private static animations: fAid.SpriteSheetAnimations;

        constructor(_name: string) {
            super(_name);
            this.addComponent(new f.ComponentTransform());
            this.show(ACTION.WAIT);
        }

        public static generateSprites(_spritesheet: f.CoatTextured): void {
            Enemy.animations = {};
            let sprite: fAid.SpriteSheetAnimation = new fAid.SpriteSheetAnimation(ACTION.WAIT, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(0, 80, 25, 24), 2, f.Vector2.ZERO(), 100, f.ORIGIN2D.BOTTOMCENTER);
            Enemy.animations[ACTION.WAIT] = sprite;
        }
        
        public show(_action: ACTION): void {
            this.setAnimation(<fAid.SpriteSheetAnimation>Enemy.animations[_action]);
        }

        public shootEnemy(): void {
            let shoot: Shoot = new Shoot();
            shoot.act(ACTION.SHOOT_ENEMY);
            this.appendChild(shoot);
        }

    }

   


}