(function() {
    /**
     * RenderTargetBase Class
     * @class
     */
    var RenderTargetBase = function(width, height) {
        this.uuid = zen3d.generateUUID();

        this.width = width;
        this.height = height;

        this.viewport = new zen3d.Vector4(0, 0, width, height);

        this.depthBuffer = true;
        this.stencilBuffer = true;
    }

    /**
     * resize render target
     * so we can recycling a render target
     */
    RenderTargetBase.prototype.resize = function(width, height) {
        // TODO
    }

    zen3d.RenderTargetBase = RenderTargetBase;
})();