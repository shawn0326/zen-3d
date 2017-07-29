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

        renderer.render(scene, camera, this.readBuffer, true);

        for(var i = 0; i < this.passes.length; i++) {
            var pass = this.passes[i];

            if(i === this.passes.length - 1) {
                pass.render(renderer, this.readBuffer, undefined);
                this.swapBuffers();
            } else {
                pass.render(renderer, this.readBuffer, this.writeBuffer);
                this.swapBuffers();
            }
        }
    }

    zen3d.EffectComposer = EffectComposer;
})();
(function() {
    var Pass = function(vertexShader, fragmentShader, uniforms) {
        var scene = this.scene = new zen3d.Scene();

        var camera = this.camera = new zen3d.Camera();
        camera.position.set(0, 1, 0);
        camera.setLookAt(new zen3d.Vector3(0, 0, 0), new zen3d.Vector3(0, 0, -1));
        camera.setOrtho(-1, 1, -1, 1, 0.1, 2);
        scene.add(camera);

        var geometry = new zen3d.PlaneGeometry(2, 2, 1, 1);
        var material = this.shader = new zen3d.ShaderMaterial(vertexShader, fragmentShader, uniforms);
        var plane = new zen3d.Mesh(geometry, material);
        scene.add(plane);
    }

    Pass.prototype.render = function(renderer, readBuffer, writeBuffer) {
        this.shader.diffuseMap = readBuffer.texture;

        renderer.render(this.scene, this.camera, writeBuffer, (writeBuffer != undefined));
    }

    zen3d.Pass = Pass;
})();