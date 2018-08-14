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

        var material = new zen3d.ShaderMaterial(zen3d.SkyShader);
        material.side = zen3d.DRAW_SIDE.BACK;
        material.cubeMap = cubeTexture;

        zen3d.Mesh.call(this, geometry, material);

        this.frustumCulled = false;
    }

    Sky.prototype = Object.create(zen3d.Mesh.prototype);
    Sky.prototype.constructor = Sky;

    zen3d.Sky = Sky;
})();