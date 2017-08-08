(function() {

    // all sprites used one shared geometry
    var sharedGeometry = new zen3d.Geometry();
    sharedGeometry.verticesArray = [-0.5, -0.5, 0, 0,
        0.5, -0.5, 1, 0,
        0.5, 0.5, 1, 1, -0.5, 0.5, 0, 1
    ];
    sharedGeometry.indicesArray = [
        0, 1, 2,
        0, 2, 3
    ];
    sharedGeometry.vertexSize = 4;
    sharedGeometry.vertexFormat = {
        "position": {size: 2, normalized: false, stride: 4, offset: 0},
        "uv": {size: 2, normalized: false, stride: 4, offset: 2}
    };

    /**
     * Sprite
     * @class
     */
    var Sprite = function(material) {
        Sprite.superClass.constructor.call(this);

        this.geometry = sharedGeometry;

        this.material = (material !== undefined) ? material : new zen3d.SpriteMaterial();

        this.type = zen3d.OBJECT_TYPE.SPRITE;

        this.layer = zen3d.RENDER_LAYER.SPRITE;
    }

    zen3d.inherit(Sprite, zen3d.Object3D);

    Sprite.geometry = sharedGeometry;

    zen3d.Sprite = Sprite;
})();