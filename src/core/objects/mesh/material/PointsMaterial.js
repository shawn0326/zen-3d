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
    }

    zen3d.inherit(PointsMaterial, zen3d.Material);

    zen3d.PointsMaterial = PointsMaterial;
})();
