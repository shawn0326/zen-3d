(function() {
    /**
     * ShaderMaterial
     * @class
     */
    var ShaderMaterial = function(vertexShader, fragmentShader, uniforms) {
        ShaderMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.SHADER;

        this.vertexShader = vertexShader || "";

        this.fragmentShader = fragmentShader || "";

        this.defines = {};

        // uniforms should match fragment shader
        this.uniforms = uniforms || {};
    }

    zen3d.inherit(ShaderMaterial, zen3d.Material);

    ShaderMaterial.prototype.copy = function(source) {
        ShaderMaterial.superClass.copy.call(this, source);

        this.vertexShader = source.vertexShader;
        this.fragmentShader = source.fragmentShader;

        return this;
    }

    zen3d.ShaderMaterial = ShaderMaterial;
})();
