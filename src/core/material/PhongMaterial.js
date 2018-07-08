(function() {

    // imports
    var MATERIAL_TYPE = zen3d.MATERIAL_TYPE;
    var Material = zen3d.Material;
    var Color3 = zen3d.Color3;

    /**
     * PhongMaterial
     * @class
     */
    function PhongMaterial() {
        Material.call(this);

        this.type = MATERIAL_TYPE.PHONG;

        // specular
        this.shininess = 30;
        this.specular = new Color3(0x666666);
        this.specularMap = null;

        this.acceptLight = true;
    }

    PhongMaterial.prototype = Object.assign(Object.create(Material.prototype), {

        constructor: PhongMaterial,

        copy: function(source) {
            Material.copy.call(this, source);
    
            this.shininess = source.shininess;
            this.specular.copy(source.specular);
            this.specularMap = source.specularMap;
    
            return this;
        }

    });

    // exports
    zen3d.PhongMaterial = PhongMaterial;
    
})();
