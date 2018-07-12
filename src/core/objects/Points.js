(function() {

    // imports
    var OBJECT_TYPE = zen3d.OBJECT_TYPE;
    var Object3D = zen3d.Object3D;

    /**
     * Points
     * @class
     */
    function Points(geometry, material) {
        Object3D.call(this);

        this.geometry = geometry;

        this.material = material;

        this.type = OBJECT_TYPE.POINT;
    }

    Points.prototype = Object.create(Object3D.prototype);
    Points.prototype.constructor = Points;

    // exports
    zen3d.Points = Points;
    
})();
