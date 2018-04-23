(function() {
    /**
     * RenderTargetBack Class
     * no texture & framebuffer in this render target, but an canvas tag element
     * @class
     */
    var RenderTargetBack = function(view) {
        RenderTargetBack.superClass.constructor.call(this, view.width, view.height);

        this.view = view; // render to canvas
    }

    zen3d.inherit(RenderTargetBack, zen3d.RenderTargetBase);

    /**
     * resize render target
     */
    RenderTargetBack.prototype.resize = function(width, height) {
        this.view.width = width;
        this.view.height = height;

        this.width = width;
        this.height = height;
    }

    RenderTargetBack.prototype.dispose = function() {
        // dispose canvas?
    }

    zen3d.RenderTargetBack = RenderTargetBack;
})();