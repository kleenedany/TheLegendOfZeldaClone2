namespace LegendofZelda {
    import f = FudgeCore;
    import fAid = FudgeAid;

    export enum FLOOR_TYPE {
        GRASS = "FloorGrass",
        PATH = "FloorPath"
    }

    export class Floor extends fAid.NodeSprite {
        private static animations: fAid.SpriteSheetAnimations;

        constructor(_name: string, _floorType: FLOOR_TYPE) {
            super(_name);
            this.addComponent(new f.ComponentTransform());
            this.show(_floorType);
        }

        public static generateSprites(_spritesheet: f.CoatTextured): void {
            Floor.animations = {};
            let sprite: fAid.SpriteSheetAnimation = new fAid.SpriteSheetAnimation(FLOOR_TYPE.GRASS, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(0, 0, 15, 16), 1, f.Vector2.ZERO(), 70, f.ORIGIN2D.BOTTOMCENTER);
            Floor.animations[FLOOR_TYPE.GRASS] = sprite;

            sprite = new fAid.SpriteSheetAnimation(FLOOR_TYPE.PATH, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(-0.5, 17, 25, 31), 1, f.Vector2.ZERO(), 150, f.ORIGIN2D.BOTTOMCENTER);
            Floor.animations[FLOOR_TYPE.PATH] = sprite;

            
        }

        public show(_type: FLOOR_TYPE): void {
            this.setAnimation(<fAid.SpriteSheetAnimation>Floor.animations[_type]);
        }

    }

}