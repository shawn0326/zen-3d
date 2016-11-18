(function() {
    /**
     * Points
     * @class
     */
    var Points = function(geometry, material) {
        Points.superClass.constructor.call(this);

        this.geometry = geometry;

        this.material = material;

        this.type = zen3d.OBJECT_TYPE.POINT;
    }

    zen3d.inherit(Points, zen3d.Object3D);

    zen3d.Points = Points;
})();
