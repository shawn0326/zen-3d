(function() {
    var CULL_FACE_TYPE = zen3d.CULL_FACE_TYPE;

    /**
     * Renderer
     * @class
     */
    var Renderer = function(view) {

        // canvas
        this.view = view;
        // gl context
        var gl = this.gl = view.getContext("webgl", {
            antialias: true, // antialias
            alpha: false, // effect performance, default false
            // premultipliedAlpha: false, // effect performance, default false
            stencil: true
        });
        // width and height, same with the canvas
        var width = view.width;
        var height = view.height;

        this.autoClear = true;

        this.glCore = new zen3d.WebGLCore(gl);

        this.performance = new zen3d.Performance();

        this.shadowMapPass = new zen3d.ShadowMapPass();
        this.forwardPass = new zen3d.ForwardPass();

        // no texture & framebuffer in this render target
        // just create this as a flag
        this.backRenderTarget = new zen3d.RenderTargetBase(width, height);

        this.shadowAutoUpdate = true;
        this.shadowNeedsUpdate = false;
    }

    /**
     * resize
     */
    Renderer.prototype.resize = function(width, height) {
        this.view.width = width;
        this.view.height = height;

        this.backRenderTarget.resize(width, height);
    }

    /**
     * render scene with camera
     */
    Renderer.prototype.render = function(scene, camera, renderTarget, forceClear) {
        var performance = this.performance;

        performance.updateFps();

        performance.startCounter("render", 60);

        scene.update(camera); // update scene

        performance.startCounter("renderShadow", 60);   

        if ( this.shadowAutoUpdate || this.shadowNeedsUpdate ) {
            this.shadowMapPass.render(this.glCore, scene);

            this.shadowNeedsUpdate = false;
        }

        performance.endCounter("renderShadow");

        if (renderTarget === undefined) {
            renderTarget = this.backRenderTarget;
        }
        this.glCore.texture.setRenderTarget(renderTarget);

        if (this.autoClear || forceClear) {
            this.glCore.state.clearColor(0, 0, 0, 0);
            this.glCore.clear(true, true, true);
        }

        performance.startCounter("renderList", 60);
        this.forwardPass.render(this.glCore, scene);
        performance.endCounter("renderList");

        if (!!renderTarget.texture) {
            this.glCore.texture.updateRenderTargetMipmap(renderTarget);
        }

        this.performance.endCounter("render");
    }

    zen3d.Renderer = Renderer;
})();