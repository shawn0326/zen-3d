(function() {

    /**
     * SkyBox
     * @class
     */
    var SkyBox = function(cubeTexture) {
        var geometry = new zen3d.CubeGeometry(1, 1, 1);

        var SkyBoxShader = zen3d.SkyBoxShader;
        if(SkyBoxShader === undefined) {
            console.error("zen3d.SkyBox required zen3d.SkyBoxShader");
        }

        var material = new zen3d.ShaderMaterial(SkyBoxShader);
        material.side = zen3d.DRAW_SIDE.BACK;
        material.cubeMap = cubeTexture;
        this.material = material;

        zen3d.Mesh.call(this, geometry, material);

        this.frustumCulled = false;
    }

    SkyBox.prototype = Object.create(zen3d.Mesh.prototype);
    SkyBox.prototype.constructor = SkyBox;

    Object.defineProperties(SkyBox.prototype, {
        level: {
            get: function() {
                return this.material.uniforms.level;
            },
            set: function(val) {
                this.material.uniforms.level = val;
            }
        }
    });

    zen3d.SkyBox = SkyBox;

})();