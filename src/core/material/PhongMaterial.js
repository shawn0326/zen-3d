(function() {
    /**
     * PhongMaterial
     * @class
     */
    var PhongMaterial = function() {
        PhongMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.PHONG;

        // specular
        this.shininess = 30;
        this.specular = new zen3d.Color3(0x666666);
        this.specularMap = null;

        this.specularFresnel = true;

        this.acceptLight = true;
    }

    zen3d.inherit(PhongMaterial, zen3d.Material);

    zen3d.PhongMaterial = PhongMaterial;
})();
