(function() {

    // imports
    var OBJECT_TYPE = zen3d.OBJECT_TYPE;
    var Object3D = zen3d.Object3D;
    var Geometry = zen3d.Geometry;
    var InterleavedBuffer = zen3d.InterleavedBuffer;
    var InterleavedBufferAttribute = zen3d.InterleavedBufferAttribute;

    // all sprites used one shared geometry
    var sharedGeometry = new Geometry();
    var array = new Float32Array([
        -0.5, -0.5, 0, 0,
        0.5, -0.5, 1, 0,
        0.5, 0.5, 1, 1,
        -0.5, 0.5, 0, 1
    ]);
    var buffer = new InterleavedBuffer(array, 4);
    sharedGeometry.addAttribute("position", new InterleavedBufferAttribute(buffer, 2, 0));
    sharedGeometry.addAttribute("uv", new InterleavedBufferAttribute(buffer, 2, 2));
    sharedGeometry.setIndex([
        0, 1, 2,
        0, 2, 3
    ]);
    sharedGeometry.computeBoundingBox();
    sharedGeometry.computeBoundingSphere();

    /**
     * Sprite
     * @class
     */
    function Sprite(material) {
        Object3D.call(this);

        this.geometry = sharedGeometry;

        this.material = (material !== undefined) ? material : new zen3d.SpriteMaterial();

        this.type = OBJECT_TYPE.SPRITE;
    }

    Sprite.geometry = sharedGeometry;

    Sprite.prototype = Object.create(Object3D.prototype);
    Sprite.prototype.constructor = Sprite;

    // exports
    zen3d.Sprite = Sprite;

})();