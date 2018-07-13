(function() {

    /**
     * SkyBox
     * @class
     */
    var SkyBox = function(cubeTexture) {
        var geometry = new zen3d.CubeGeometry(1, 1, 1);

        if(zen3d.SkyBoxShader === undefined) {
            console.error("zen3d.SkyBox required zen3d.SkyBoxShader");
        }

        var material = new zen3d.ShaderMaterial(zen3d.SkyBoxShader.vertexShader, zen3d.SkyBoxShader.fragmentShader);
        material.side = zen3d.DRAW_SIDE.BACK;
        material.cubeMap = cubeTexture;

        SkyBox.prototype.call(this, geometry, material);

        this.frustumCulled = false;
    }

    SkyBox.prototype = Object.create(zen3d.Mesh.prototype);
    SkyBox.prototype.constructor = SkyBox;

    zen3d.SkyBox = SkyBox;

})();