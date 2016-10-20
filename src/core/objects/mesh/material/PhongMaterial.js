(function() {
    /**
     * PhongMaterial
     * @class
     */
    var PhongMaterial = function() {
        PhongMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.PHONG;

        this.specular = 30;

        this.specularColor = 0xffffff;
    }

    zen3d.inherit(PhongMaterial, zen3d.Material);

    zen3d.PhongMaterial = PhongMaterial;
})();
