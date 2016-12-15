(function() {
    /**
     * RenderTargetCube Class
     * @class
     */
    var RenderTargetCube = function(width, height) {
        RenderTargetCube.superClass.constructor.call(this, width, height);

        this.texture = new zen3d.TextureCube();

        this.activeCubeFace = 0; // PX 0, NX 1, PY 2, NY 3, PZ 4, NZ 5
    }

    zen3d.inherit(RenderTargetCube, zen3d.RenderTargetBase);

    zen3d.RenderTargetCube = RenderTargetCube;
})();