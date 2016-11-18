(function() {
    /**
     * CubeMaterial
     * @class
     */
    var CubeMaterial = function() {
        CubeMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.CUBE;

        this.cubeMap = null;
    }

    zen3d.inherit(CubeMaterial, zen3d.Material);

    zen3d.CubeMaterial = CubeMaterial;
})();
