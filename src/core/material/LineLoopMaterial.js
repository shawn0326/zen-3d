(function() {
    /**
     * LineLoopMaterial
     * @class
     */
    var LineLoopMaterial = function() {
        LineLoopMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.LINE_LOOP;

        // chrome bug on MacOS: gl.lineWidth no effect
        this.lineWidth = 1;

        this.drawMode = zen3d.DRAW_MODE.LINE_LOOP;
    }

    zen3d.inherit(LineLoopMaterial, zen3d.Material);

    zen3d.LineLoopMaterial = LineLoopMaterial;
})();
