(function() {
    /**
     * RenderTarget2D Class
     * @class
     */
    var RenderTarget2D = function(width, height) {
        RenderTarget2D.superClass.constructor.call(this, width, height);

        this.texture = new zen3d.Texture2D();
    }

    zen3d.inherit(RenderTarget2D, zen3d.RenderTargetBase);

    /**
     * resize render target
     * so we can recycling a render target
     */
    RenderTarget2D.prototype.resize = function(width, height) {
        // TODO
    }

    zen3d.RenderTarget2D = RenderTarget2D;
})();