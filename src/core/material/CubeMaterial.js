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

    CubeMaterial.prototype.copy = function(source) {
        CubeMaterial.superClass.copy.call(this, source);

        this.cubeMap = source.cubeMap;

        return this;
    }

    zen3d.CubeMaterial = CubeMaterial;
})();
