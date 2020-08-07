namespace LegendofZelda {
    import f = FudgeCore;
    import fAid = FudgeAid;

    export enum OBJECT {
        WALL = "ObjectWall",
        HEDGEVERTICAL = "ObjectHedgeVertical",
        HEDGEHORIZONTAL = "ObjectHedgeHorizontal",
        HOUSE = "House",
        FOUNTAIN = "Fountain",
        TREE = "Tree"
    }

    export class MapObjects extends fAid.NodeSprite {
        private static animations: fAid.SpriteSheetAnimations;

        constructor(_name: string, _object: OBJECT) {
            super(_name);
            this.addComponent(new f.ComponentTransform());
            this.show(_object);
        }

        public static generateSprites(_spritesheet: f.CoatTextured): void {
            MapObjects.animations = {};
            let sprite: fAid.SpriteSheetAnimation = new fAid.SpriteSheetAnimation(OBJECT.HEDGEVERTICAL, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(0, 100, 32, 15), 1, f.Vector2.ZERO(), 70, f.ORIGIN2D.BOTTOMCENTER);
            MapObjects.animations[OBJECT.HEDGEVERTICAL] = sprite;

            sprite = new fAid.SpriteSheetAnimation(OBJECT.HEDGEHORIZONTAL, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(0, 115, 16, 36 ), 1, f.Vector2.ZERO(), 70, f.ORIGIN2D.BOTTOMCENTER);
            MapObjects.animations[OBJECT.HEDGEHORIZONTAL] = sprite;

            sprite = new fAid.SpriteSheetAnimation(OBJECT.HOUSE, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(0, 155, 74, 86), 1, f.Vector2.ZERO(), 70, f.ORIGIN2D.BOTTOMCENTER);
            MapObjects.animations[OBJECT.HOUSE] = sprite;

            sprite = new fAid.SpriteSheetAnimation(OBJECT.TREE, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(2, 305, 32, 33), 1, f.Vector2.ZERO(), 50, f.ORIGIN2D.BOTTOMCENTER);
            MapObjects.animations[OBJECT.TREE] = sprite;

            sprite = new fAid.SpriteSheetAnimation(OBJECT.FOUNTAIN, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(2, 250, 49, 48), 1, f.Vector2.ZERO(), 100, f.ORIGIN2D.BOTTOMCENTER);
            MapObjects.animations[OBJECT.FOUNTAIN] = sprite;

        }

        public show(_object: OBJECT): void {
            this.setAnimation(<fAid.SpriteSheetAnimation>MapObjects.animations[_object]);
        }

    }
}