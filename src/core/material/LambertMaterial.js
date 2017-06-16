(function() {
    /**
     * LambertMaterial
     * @class
     */
    var LambertMaterial = function() {
        LambertMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.LAMBERT;

        this.acceptLight = true;
    }

    zen3d.inherit(LambertMaterial, zen3d.Material);

    zen3d.LambertMaterial = LambertMaterial;
})();
