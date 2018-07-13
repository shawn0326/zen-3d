(function() {

    // imports
    var RenderTargetBase = zen3d.RenderTargetBase;
    var TextureCube = zen3d.TextureCube;

    /**
     * RenderTargetCube Class
     * @class
     */
    function RenderTargetCube(width, height) {
        RenderTargetBase.call(this, width, height);

        this.texture = new TextureCube();

        this.activeCubeFace = 0; // PX 0, NX 1, PY 2, NY 3, PZ 4, NZ 5
    }

    RenderTargetCube.prototype = Object.create(RenderTargetBase.prototype);
    RenderTargetCube.prototype.constructor = RenderTargetCube;

    // exports
    zen3d.RenderTargetCube = RenderTargetCube;
    
})();