(function() {

    // imports
    var MATERIAL_TYPE = zen3d.MATERIAL_TYPE;
    var BLEND_TYPE = zen3d.BLEND_TYPE;
    var Material = zen3d.Material;

    /**
     * DistanceMaterial
     * @class
     */
    function DistanceMaterial() {
        Material.call(this);

        this.type = MATERIAL_TYPE.DISTANCE;

        this.blending = BLEND_TYPE.NONE;
    }

    DistanceMaterial.prototype = Object.assign(Object.create(Material.prototype), {

        constructor: DistanceMaterial

    });

    zen3d.DistanceMaterial = DistanceMaterial;
})();