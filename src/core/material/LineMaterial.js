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

    LineMaterial.prototype.copy = function(source) {
        LineMaterial.superClass.copy.call(this, source);

        this.lineWidth = source.lineWidth;

        return this;
    }

    zen3d.LineMaterial = LineMaterial;
})();
