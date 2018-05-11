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

        SkyBox.superClass.constructor.call(this, geometry, material);

        this.frustumCulled = false;
    }

    zen3d.inherit(SkyBox, zen3d.Mesh);

    zen3d.SkyBox = SkyBox;
})();