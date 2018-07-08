(function() {

    // imports
    var MATERIAL_TYPE = zen3d.MATERIAL_TYPE;
    var Material = zen3d.Material;

    /**
     * BasicMaterial
     * @class
     */
    function BasicMaterial() {
        Material.call(this);

        this.type = MATERIAL_TYPE.BASIC;
    }

    BasicMaterial.prototype = Object.assign(Object.create(Material.prototype), {

        constructor: BasicMaterial

    });

    // exports
    zen3d.BasicMaterial = BasicMaterial;

})();
