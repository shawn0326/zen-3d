(function() {

    // imports
    var MATERIAL_TYPE = zen3d.MATERIAL_TYPE;
    var Material = zen3d.Material;

    /**
     * ShaderMaterial
     * @class
     */
    function ShaderMaterial(vertexShader, fragmentShader, uniforms) {
        Material.call(this);

        this.type = MATERIAL_TYPE.SHADER;

        this.vertexShader = vertexShader || "";

        this.fragmentShader = fragmentShader || "";

        this.defines = {};

        // uniforms should match fragment shader
        this.uniforms = uniforms || {};
    }

    ShaderMaterial.prototype = Object.assign(Object.create(Material.prototype), {

        constructor: ShaderMaterial,

        copy: function(source) {
            Material.copy.call(this, source);
    
            this.vertexShader = source.vertexShader;
            this.fragmentShader = source.fragmentShader;
    
            return this;
        }

    });

    // exports
    zen3d.ShaderMaterial = ShaderMaterial;

})();
