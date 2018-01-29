(function() {
    /**
     * DistanceMaterial
     * @class
     */
    var DistanceMaterial = function() {
        DistanceMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.DISTANCE;

        this.blending = zen3d.BLEND_TYPE.NONE;
    }

    zen3d.inherit(DistanceMaterial, zen3d.Material);

    zen3d.DistanceMaterial = DistanceMaterial;
})();