(function() {
    /**
     * ParticleMaterial
     * @class
     */
    var ParticleMaterial = function() {
        ParticleMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.PARTICLE;
    }

    zen3d.inherit(ParticleMaterial, zen3d.Material);

    zen3d.ParticleMaterial = ParticleMaterial;
})();