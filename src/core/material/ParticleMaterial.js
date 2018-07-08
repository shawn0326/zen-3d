(function() {

    var MATERIAL_TYPE = zen3d.MATERIAL_TYPE;
    var BLEND_TYPE = zen3d.BLEND_TYPE;
    var DRAW_MODE = zen3d.DRAW_MODE;
    var Material = zen3d.Material;

    /**
     * ParticleMaterial
     * @class
     */
    function ParticleMaterial() {
        Material.call(this);

        this.type = MATERIAL_TYPE.PARTICLE;

        this.transparent = true;

        this.blending = BLEND_TYPE.ADD;

        this.depthTest = true;
        this.depthWrite = false;

        this.drawMode = DRAW_MODE.POINTS;
    }

    ParticleMaterial.prototype = Object.assign(Object.create(Material.prototype), {

        constructor: ParticleMaterial

    });
    
    // exports
    zen3d.ParticleMaterial = ParticleMaterial;

})();