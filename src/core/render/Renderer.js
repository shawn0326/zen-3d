(function() {
    /**
     * Renderer
     * @class
     */
    var Renderer = function(view, options) {

        this.backRenderTarget = new zen3d.RenderTargetBack(view);
        
        var gl = view.getContext("webgl", options || {
            antialias: true, // antialias
            alpha: false, // effect performance, default false
            // premultipliedAlpha: false, // effect performance, default false
            stencil: true
        });
        this.glCore = new zen3d.WebGLCore(gl);

        this.autoClear = true;

        this.performance = new zen3d.Performance();

        this.shadowMapPass = new zen3d.ShadowMapPass();
        this.forwardPass = new zen3d.ForwardPass();

        this.shadowAutoUpdate = true;
        this.shadowNeedsUpdate = false;

        this.matrixAutoUpdate = true;
        this.lightsAutoupdate = true;
    }

    /**
     * render scene with camera
     */
    Renderer.prototype.render = function(scene, camera, renderTarget, forceClear) {
        var performance = this.performance;

        performance.updateFps();

        performance.startCounter("render", 60);

        this.matrixAutoUpdate && scene.updateMatrix();
        this.lightsAutoupdate && scene.updateLights();

        performance.startCounter("renderShadow", 60);   

        if ( this.shadowAutoUpdate || this.shadowNeedsUpdate ) {
            this.shadowMapPass.render(this.glCore, scene, camera);

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
        this.forwardPass.render(this.glCore, scene, camera);
        performance.endCounter("renderList");

        if (!!renderTarget.texture) {
            this.glCore.texture.updateRenderTargetMipmap(renderTarget);
        }

        this.performance.endCounter("render");
    }

    zen3d.Renderer = Renderer;
})();