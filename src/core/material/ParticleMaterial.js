(function() {
    /**
     * ParticleMaterial
     * @class
     */
    var ParticleMaterial = function() {
        ParticleMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.PARTICLE;

        this.transparent = true;

        this.blending = zen3d.BLEND_TYPE.ADD;

        this.depthTest = true;
        this.depthWrite = false;

        this.drawMode = zen3d.DRAW_MODE.POINTS;
    }

    zen3d.inherit(ParticleMaterial, zen3d.Material);

    zen3d.ParticleMaterial = ParticleMaterial;
})();