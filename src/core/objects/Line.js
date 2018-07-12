(function() {

    // imports
    var OBJECT_TYPE = zen3d.OBJECT_TYPE;
    var Object3D = zen3d.Object3D;

    /**
     * Line
     * @class
     */
    function Line(geometry, material) {
        Object3D.call(this);

        this.geometry = geometry;

        this.material = material;

        this.type = OBJECT_TYPE.LINE;
    }

    Line.prototype = Object.assign(Object.create(Object3D.prototype), {

        constructor: Line,

        /**
         * raycast
         */
        raycast: function() {
            // TODO
        }

    });

    // exports
    zen3d.Line = Line;
    
})();
