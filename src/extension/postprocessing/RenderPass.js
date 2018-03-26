(function() {
    var RenderPass = function(scene, camera) {
        RenderPass.superClass.constructor.call(this);

        this.scene = scene;
    	this.camera = camera;

    	this.needsSwap = false;
    }

    zen3d.inherit(RenderPass, zen3d.Pass);

    RenderPass.prototype.render = function(renderer, readBuffer, writeBuffer) {

        renderer.render(this.scene, this.camera, this.renderToScreen ? null : readBuffer, this.clear);

    }

    zen3d.RenderPass = RenderPass;
})();