(function() {
    /**
     * PhoneMaterial
     * @class
     */
    var PhoneMaterial = function() {
        PhoneMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.PHONE;

        this.specular = 10;
    }

    zen3d.inherit(PhoneMaterial, zen3d.Material);

    zen3d.PhoneMaterial = PhoneMaterial;
})();
