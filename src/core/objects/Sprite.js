(function() {

    // all sprites used one shared geometry
    var sharedGeometry = new zen3d.Geometry();
    var array = new Float32Array([
        -0.5, -0.5, 0, 0,
        0.5, -0.5, 1, 0,
        0.5, 0.5, 1, 1,
        -0.5, 0.5, 0, 1
    ]);
    var buffer = new zen3d.InterleavedBuffer(array, 4);
    sharedGeometry.addAttribute("position", new zen3d.InterleavedBufferAttribute(buffer, 2, 0));
    sharedGeometry.addAttribute("uv", new zen3d.InterleavedBufferAttribute(buffer, 2, 2));
    sharedGeometry.setIndex([
        0, 1, 2,
        0, 2, 3
    ]);

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