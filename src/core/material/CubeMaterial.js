(function() {

    // imports
    var MATERIAL_TYPE = zen3d.MATERIAL_TYPE;
    var DRAW_SIDE= zen3d.DRAW_SIDE;
    var Material = zen3d.Material;

    /**
     * CubeMaterial
     * @class
     */
    function CubeMaterial() {
        Material.call(this);

        this.type = MATERIAL_TYPE.CUBE;

        this.side = DRAW_SIDE.BACK;

        this.cubeMap = null;
    }

    CubeMaterial.prototype = Object.assign(Object.create(Material.prototype), {

        constructor: CubeMaterial,

        copy: function(source) {
            Material.copy.call(this, source);
    
            this.cubeMap = source.cubeMap;
    
            return this;
        }

    });

    // exports
    zen3d.CubeMaterial = CubeMaterial;

})();
