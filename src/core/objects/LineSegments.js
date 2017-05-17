(function() {
    /**
     * LineSegments
     * @class
     */
    var LineSegments = function(geometry, material) {
        LineSegments.superClass.constructor.call(this, geometry, material);

        this.type = zen3d.OBJECT_TYPE.LINE_SEGMENTS;
    }

    zen3d.inherit(LineSegments, zen3d.Line);

    zen3d.LineSegments = LineSegments;
})();