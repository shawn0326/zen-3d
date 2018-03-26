(function() {
    /**
     * EffectComposer for post processing effect
     */
    var EffectComposer = function(renderer) {
        this.renderer = renderer;

        this.passes = [];

        this.renderTarget1 = new zen3d.RenderTarget2D(renderer.width, renderer.height);
        this.renderTarget1.texture.minFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;
        this.renderTarget1.texture.magFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;
        this.renderTarget2 = new zen3d.RenderTarget2D(renderer.width, renderer.height);
        this.renderTarget2.texture.minFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;
        this.renderTarget2.texture.magFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;

        this.writeBuffer = this.renderTarget1;
	    this.readBuffer = this.renderTarget2;
    }

    EffectComposer.prototype.swapBuffers = function() {
        var tmp = this.readBuffer;
		this.readBuffer = this.writeBuffer;
		this.writeBuffer = tmp;
    }

    EffectComposer.prototype.resize = function(width, height) {
        this.renderTarget1.resize(width, height);
        this.renderTarget2.resize(width, height);
    }

    EffectComposer.prototype.addPass = function(pass) {
        this.passes.push( pass );
    }

    EffectComposer.prototype.render = function(scene, camera) {
        var renderer = this.renderer;

        for(var i = 0; i < this.passes.length; i++) {
            var pass = this.passes[i];

            if ( pass.enabled === false ) continue;

            pass.render(renderer, this.readBuffer, this.writeBuffer);

            if(pass.needsSwap) {
                this.swapBuffers();
            }
        }
    }

    zen3d.EffectComposer = EffectComposer;
})();