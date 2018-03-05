(function() {
    /**
     * PBRMaterial
     * @class
     */
    var PBRMaterial = function() {
        PBRMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.PBR;

        this.roughness = 0.5;
	    this.metalness = 0.5;

        this.acceptLight = true;
    }

    zen3d.inherit(PBRMaterial, zen3d.Material);

    PBRMaterial.prototype.copy = function(source) {
        PBRMaterial.superClass.copy.call(this, source);

        this.roughness = source.roughness;
        this.metalness = source.metalness;

        return this;
    }

    zen3d.PBRMaterial = PBRMaterial;
})();
