(function() {

    // imports
    var MATERIAL_TYPE = zen3d.MATERIAL_TYPE;
    var Material = zen3d.Material;

    /**
     * PBRMaterial
     * @class
     */
    function PBRMaterial() {
        Material.call(this);

        this.type = MATERIAL_TYPE.PBR;

        this.roughness = 0.5;
	    this.metalness = 0.5;

        this.roughnessMap = null;
	    this.metalnessMap = null;

        this.acceptLight = true;
    }

    PBRMaterial.prototype = Object.assign(Object.create(Material.prototype), {

        constructor: PBRMaterial,

        copy: function(source) {
            Material.copy.call(this, source);
    
            this.roughness = source.roughness;
            this.metalness = source.metalness;
    
            return this;
        }

    });
    
    // exports
    zen3d.PBRMaterial = PBRMaterial;

})();
