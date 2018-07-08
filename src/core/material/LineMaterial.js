(function() {

    // imports
    var MATERIAL_TYPE = zen3d.MATERIAL_TYPE;
    var DRAW_MODE = zen3d.DRAW_MODE;
    var Material = zen3d.Material;

    /**
     * LineMaterial
     * @class
     */
    function LineMaterial() {
        Material.call(this);

        this.type = MATERIAL_TYPE.LINE;

        // chrome bug on MacOS: gl.lineWidth no effect
        this.lineWidth = 1;

        this.drawMode = DRAW_MODE.LINES;
    }

    LineMaterial.prototype = Object.assign(Object.create(Material.prototype), {

        constructor: LineMaterial,

        copy: function(source) {
            Material.copy.call(this, source);
    
            this.lineWidth = source.lineWidth;
    
            return this;
        }

    });

    // exports
    zen3d.LineMaterial = LineMaterial;

})();
