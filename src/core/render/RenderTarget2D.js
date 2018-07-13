(function() {

    // imports
    var RenderTargetBase = zen3d.RenderTargetBase;
    var Texture2D = zen3d.Texture2D;

    /**
     * RenderTarget2D Class
     * @class
     */
    function RenderTarget2D(width, height) {
        RenderTargetBase.call(this, width, height);

        this.texture = new Texture2D();

        this.depthTexture = null;
    }

    RenderTarget2D.prototype = Object.create(RenderTargetBase.prototype);
    RenderTarget2D.prototype.constructor = RenderTarget2D;

    // exports
    zen3d.RenderTarget2D = RenderTarget2D;

})();