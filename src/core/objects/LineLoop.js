(function() {
    /**
     * LineLoop
     * @class
     */
    var LineLoop = function(geometry, material) {
        LineLoop.superClass.constructor.call(this, geometry, material);

        this.type = zen3d.OBJECT_TYPE.LINE_LOOP;
    }

    zen3d.inherit(LineLoop, zen3d.Line);

    zen3d.LineLoop = LineLoop;
})();
