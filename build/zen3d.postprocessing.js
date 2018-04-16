(function() {
    /**
     * EffectComposer for post processing effect
     */
    var EffectComposer = function(renderer) {
        this.renderer = renderer;

        this.passes = [];

        this.renderTarget1 = new zen3d.RenderTarget2D(renderer.backRenderTarget.width, renderer.backRenderTarget.height);
        this.renderTarget1.texture.minFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;
        this.renderTarget1.texture.magFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;
        this.renderTarget2 = new zen3d.RenderTarget2D(renderer.backRenderTarget.width, renderer.backRenderTarget.height);
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
(function() {
    var Pass = function() {
        // if set to true, the pass is processed by the composer
	    this.enabled = true;

        // if set to true, the pass indicates to swap read and write buffer after rendering
        this.needsSwap = true;

        // if set to true, the pass clears its buffer before rendering
	    this.clear = false;

        // if set to true, the result of the pass is rendered to screen
	    this.renderToScreen = false;
    }

    Pass.prototype.render = function(renderer, readBuffer, writeBuffer) {
        console.error( 'zen3d.Pass: .render() must be implemented in derived pass.' );
    }

    zen3d.Pass = Pass;
})();
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
(function() {

    function cloneUniforms(uniforms_src) {
        var uniforms_dst = {};

        for(var name in uniforms_src) {
            var uniform_src = uniforms_src[name];
            // TODO zen3d object clone
            if ( Array.isArray( uniform_src ) ) {
                uniforms_dst[name] = uniform_src.slice();
            } else {
                uniforms_dst[name] = uniform_src;
            }
        }

        return uniforms_dst;
    }

    var ShaderPass = function(shader, textureID) {
        ShaderPass.superClass.constructor.call(this);

        this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

        var scene = this.scene = new zen3d.Scene();

        var camera = this.camera = new zen3d.Camera();
        camera.position.set(0, 1, 0);
        camera.setLookAt(new zen3d.Vector3(0, 0, 0), new zen3d.Vector3(0, 0, -1));
        camera.setOrtho(-1, 1, -1, 1, 0.1, 2);
        scene.add(camera);

        var geometry = new zen3d.PlaneGeometry(2, 2, 1, 1);
        this.uniforms = cloneUniforms(shader.uniforms);
        var material = this.material = new zen3d.ShaderMaterial(shader.vertexShader, shader.fragmentShader, this.uniforms);
        var plane = new zen3d.Mesh(geometry, material);
        scene.add(plane);
    }

    zen3d.inherit(ShaderPass, zen3d.Pass);

    ShaderPass.prototype.render = function(renderer, readBuffer, writeBuffer) {
        this.uniforms[this.textureID] = readBuffer.texture;

        if(this.renderToScreen) {
            renderer.render(this.scene, this.camera);
        } else {
            renderer.render(this.scene, this.camera, writeBuffer, this.clear);
        }
    }

    zen3d.ShaderPass = ShaderPass;
})();