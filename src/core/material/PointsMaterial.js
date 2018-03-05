(function() {
    /**
     * PointsMaterial
     * @class
     */
    var PointsMaterial = function() {
        PointsMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.POINT;

        this.size = 1;

        this.sizeAttenuation = true;

        this.drawMode = zen3d.DRAW_MODE.POINTS;
    }

    zen3d.inherit(PointsMaterial, zen3d.Material);

    PointsMaterial.prototype.copy = function(source) {
        PointsMaterial.superClass.copy.call(this, source);

        this.size = source.size;
        this.sizeAttenuation = source.sizeAttenuation;

        return this;
    }

    zen3d.PointsMaterial = PointsMaterial;
})();
