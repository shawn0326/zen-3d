(function() {
    /**
     * Sky
     * @class
     */
    var Sky = function(cubeTexture) {
        var geometry = new zen3d.CubeGeometry(1, 1, 1);

        if(zen3d.SkyShader === undefined) {
            console.error("zen3d.Sky required zen3d.SkyShader");
        }

        var material = new zen3d.ShaderMaterial(zen3d.SkyShader.vertexShader, zen3d.SkyShader.fragmentShader, zen3d.cloneUniforms(zen3d.SkyShader.uniforms));
        material.side = zen3d.DRAW_SIDE.BACK;
        material.cubeMap = cubeTexture;

        Sky.superClass.constructor.call(this, geometry, material);

        this.frustumCulled = false;
    }

    zen3d.inherit(Sky, zen3d.Mesh);

    zen3d.Sky = Sky;
})();