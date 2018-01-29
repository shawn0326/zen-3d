(function() {
    /**
     * DepthMaterial
     * @class
     */
    var DepthMaterial = function() {
        DepthMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.DEPTH;

        this.blending = zen3d.BLEND_TYPE.NONE;
    }

    zen3d.inherit(DepthMaterial, zen3d.Material);

    zen3d.DepthMaterial = DepthMaterial;
})();