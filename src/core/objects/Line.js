(function() {
    /**
     * Line
     * @class
     */
    var Line = function(geometry, material) {
        Line.superClass.constructor.call(this);

        this.geometry = geometry;

        this.material = material;

        this.type = zen3d.OBJECT_TYPE.LINE;
    }

    zen3d.inherit(Line, zen3d.Object3D);

    /**
     * raycast
     */
    Line.prototype.raycast = function() {
        // TODO
    }

    zen3d.Line = Line;
})();
