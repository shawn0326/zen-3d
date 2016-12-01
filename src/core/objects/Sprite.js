(function() {

    // all sprites used one shared geometry
    var sharedGeometry = new zen3d.Geometry();
    sharedGeometry.verticesArray = [-0.5, -0.5, 0, 0,
        0.5, -0.5, 1, 0,
        0.5, 0.5, 1, 1, -0.5, 0.5, 0, 1
    ];
    sharedGeometry.indicesArray = [
        2, 1, 0,
        3, 2, 0
    ];
    sharedGeometry.vertexSize = 4;

    /**
     * Sprite
     * @class
     */
    var Sprite = function(material) {
        Sprite.superClass.constructor.call(this);

        this.geometry = sharedGeometry;

        this.material = (material !== undefined) ? material : new zen3d.SpriteMaterial();

        this.type = zen3d.OBJECT_TYPE.SPRITE;
    }

    zen3d.inherit(Sprite, zen3d.Object3D);

    Sprite.geometry = sharedGeometry;

    zen3d.Sprite = Sprite;
})();