"use strict";
var LegendofZelda;
(function (LegendofZelda) {
    var f = FudgeCore;
    var fAid = FudgeAid;
    let FLOOR_TYPE;
    (function (FLOOR_TYPE) {
        FLOOR_TYPE["GRASS"] = "FloorGrass";
        FLOOR_TYPE["PATH"] = "FloorPath";
    })(FLOOR_TYPE = LegendofZelda.FLOOR_TYPE || (LegendofZelda.FLOOR_TYPE = {}));
    class Floor extends fAid.NodeSprite {
        constructor(_name, _floorType) {
            super(_name);
            this.addComponent(new f.ComponentTransform());
            this.show(_floorType);
        }
        static generateSprites(_spritesheet) {
            Floor.animations = {};
            let sprite = new fAid.SpriteSheetAnimation(FLOOR_TYPE.GRASS, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(0, 0, 15, 16), 1, f.Vector2.ZERO(), 70, f.ORIGIN2D.BOTTOMCENTER);
            Floor.animations[FLOOR_TYPE.GRASS] = sprite;
            sprite = new fAid.SpriteSheetAnimation(FLOOR_TYPE.PATH, _spritesheet);
            sprite.generateByGrid(f.Rectangle.GET(-0.5, 17, 25, 31), 1, f.Vector2.ZERO(), 150, f.ORIGIN2D.BOTTOMCENTER);
            Floor.animations[FLOOR_TYPE.PATH] = sprite;
        }
        show(_type) {
            this.setAnimation(Floor.animations[_type]);
        }
    }
    LegendofZelda.Floor = Floor;
})(LegendofZelda || (LegendofZelda = {}));
//# sourceMappingURL=Floor.js.map