(function() {

    // imports
    var MATERIAL_TYPE = zen3d.MATERIAL_TYPE;
    var DRAW_MODE = zen3d.DRAW_MODE;
    var Material = zen3d.Material;

    /**
     * PointsMaterial
     * @class
     */
    function PointsMaterial() {
        Material.call(this);

        this.type = MATERIAL_TYPE.POINT;

        this.size = 1;

        this.sizeAttenuation = true;

        this.drawMode = DRAW_MODE.POINTS;
    }

    PointsMaterial.prototype = Object.assign(Object.create(Material.prototype), {

        constructor: PointsMaterial,

        copy: function(source) {
            Material.copy.call(this, source);
    
            this.size = source.size;
            this.sizeAttenuation = source.sizeAttenuation;
    
            return this;
        }

    });

    // exports
    zen3d.PointsMaterial = PointsMaterial;
    
})();
