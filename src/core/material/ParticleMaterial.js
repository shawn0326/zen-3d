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
    }

    zen3d.inherit(ParticleMaterial, zen3d.Material);

    zen3d.ParticleMaterial = ParticleMaterial;
})();