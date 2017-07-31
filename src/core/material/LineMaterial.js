(function() {
    /**
     * LineMaterial
     * @class
     */
    var LineMaterial = function() {
        LineMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.LINE;

        // chrome bug on MacOS: gl.lineWidth no effect
        this.lineWidth = 1;

        this.drawMode = zen3d.DRAW_MODE.LINES;
    }

    zen3d.inherit(LineMaterial, zen3d.Material);

    zen3d.LineMaterial = LineMaterial;
})();
