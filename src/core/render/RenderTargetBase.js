(function() {
    /**
     * RenderTargetBase Class
     * @class
     */
    var RenderTargetBase = function(width, height) {
        RenderTargetBase.superClass.constructor.call(this);

        this.uuid = zen3d.generateUUID();

        this.width = width;
        this.height = height;

        this.depthBuffer = true;
        this.stencilBuffer = true;
    }

    zen3d.inherit(RenderTargetBase, zen3d.EventDispatcher);

    /**
     * resize render target
     */
    RenderTargetBase.prototype.resize = function(width, height) {
        if(this.width !== width || this.height !== height) {
            this.dispose();
        }

        this.width = width;
        this.height = height;
    }

    RenderTargetBase.prototype.dispose = function() {
        this.dispatchEvent({type: 'dispose'});
    }

    zen3d.RenderTargetBase = RenderTargetBase;
})();