"use strict";
var LegendofZelda;
(function (LegendofZelda) {
    var f = FudgeCore;
    var fAid = FudgeAid;
    let OBJECT;
    (function (OBJECT) {
        OBJECT["WALL"] = "ObjectWall";
        OBJECT["HEDGEVERTICAL"] = "ObjectHedgeVertical";
        OBJECT["HEDGEHORIZONTAL"] = "ObjectHedgeHorizontal";
        OBJECT["HOUSE"] = "House";
        OBJECT["FOUNTAIN"] = "Fountain";
        OBJECT["TREE"] = "Tree";
    })(OBJECT = LegendofZelda.OBJECT || (LegendofZelda.OBJECT = {}));
    class MapObjects extends fAid.NodeSprite {
        constructor(_name, _object) {
            super(_name);
            this.addComponent(new f.ComponentTransform());
            this.show(_object);
        }
        static generateSprites(_spritesheet) {
            MapObjects.animations = {};
            let sprite = new fAid.SpriteSheetAnimation(OBJECT.HEDGEVERTICAL, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(0, 100, 32, 15), 1, f.Vector2.ZERO(), 70, f.ORIGIN2D.BOTTOMCENTER);
            MapObjects.animations[OBJECT.HEDGEVERTICAL] = sprite;
            sprite = new fAid.SpriteSheetAnimation(OBJECT.HEDGEHORIZONTAL, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(0, 115, 16, 36), 1, f.Vector2.ZERO(), 70, f.ORIGIN2D.BOTTOMCENTER);
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
        show(_object) {
            this.setAnimation(MapObjects.animations[_object]);
        }
    }
    LegendofZelda.MapObjects = MapObjects;
})(LegendofZelda || (LegendofZelda = {}));
//# sourceMappingURL=MapObjects.js.map