(function() {
    /**
     * Sprite
     * @class
     */
    var Sprite = function(material) {
        Sprite.superClass.constructor.call(this);

        this.material = (material !== undefined) ? material : new zen3d.SpriteMaterial();

        this.type = zen3d.OBJECT_TYPE.SPRITE;
    }

    zen3d.inherit(Sprite, zen3d.Object3D);

    zen3d.Sprite = Sprite;
})();
