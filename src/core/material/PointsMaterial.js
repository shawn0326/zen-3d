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

    zen3d.PointsMaterial = PointsMaterial;
})();
