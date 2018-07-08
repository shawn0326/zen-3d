(function() {

    // imports
    var MATERIAL_TYPE = zen3d.MATERIAL_TYPE;
    var DRAW_MODE = zen3d.DRAW_MODE;
    var Material = zen3d.Material;

    /**
     * LineLoopMaterial
     * @class
     */
    function LineLoopMaterial() {
        Material.call(this);

        this.type = MATERIAL_TYPE.LINE_LOOP;

        // chrome bug on MacOS: gl.lineWidth no effect
        this.lineWidth = 1;

        this.drawMode = DRAW_MODE.LINE_LOOP;
    }

    LineLoopMaterial.prototype = Object.assign(Object.create(Material.prototype), {

        constructor: LineLoopMaterial,

        copy: function(source) {
            Material.copy.call(this, source);
    
            this.lineWidth = source.lineWidth;
    
            return this;
        }

    });

    // exports
    zen3d.LineLoopMaterial = LineLoopMaterial;

})();
