(function() {

    // imports
    var MATERIAL_TYPE = zen3d.MATERIAL_TYPE;
    var Material = zen3d.Material;

    /**
     * LambertMaterial
     * @class
     */
    function LambertMaterial() {
        Material.call(this);

        this.type = MATERIAL_TYPE.LAMBERT;

        this.acceptLight = true;
    }

    LambertMaterial.prototype = Object.assign(Object.create(Material.prototype), {

        constructor: LambertMaterial

    });

    // exports
    zen3d.LambertMaterial = LambertMaterial;

})();
