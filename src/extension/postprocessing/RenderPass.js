(function() {

    var RenderPass = function(scene, camera) {
        zen3d.Pass.call(this);

        this.scene = scene;
    	this.camera = camera;

    	this.needsSwap = false;
    }

    RenderPass.prototype = Object.create(zen3d.Pass.prototype);
    RenderPass.prototype.constructor = RenderPass;

    RenderPass.prototype.render = function(renderer, readBuffer, writeBuffer) {

        renderer.render(this.scene, this.camera, this.renderToScreen ? null : readBuffer, this.clear);

    }

    zen3d.RenderPass = RenderPass;

})();