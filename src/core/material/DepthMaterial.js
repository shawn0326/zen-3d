(function() {

    // imports
    var MATERIAL_TYPE = zen3d.MATERIAL_TYPE;
    var BLEND_TYPE = zen3d.BLEND_TYPE;
    var Material = zen3d.Material;

    /**
     * DepthMaterial
     * @class
     */
    function DepthMaterial() {
        Material.call(this);

        this.type = MATERIAL_TYPE.DEPTH;

        this.blending = BLEND_TYPE.NONE;

        this.packToRGBA = false;
    }

    DepthMaterial.prototype = Object.assign(Object.create(Material.prototype), {

        constructor: DepthMaterial

    });

    // exports
    zen3d.DepthMaterial = DepthMaterial;

})();