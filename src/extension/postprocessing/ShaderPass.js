(function() {

    var ShaderPass = function(shader, textureID) {
        zen3d.Pass.call(this);

        this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

        var scene = this.scene = new zen3d.Scene();

        var camera = this.camera = new zen3d.Camera();
        camera.position.set(0, 1, 0);
        camera.lookAt(new zen3d.Vector3(0, 0, 0), new zen3d.Vector3(0, 0, -1));
        camera.setOrtho(-1, 1, -1, 1, 0.1, 2);
        scene.add(camera);

        var geometry = new zen3d.PlaneGeometry(2, 2, 1, 1);
        this.uniforms = zen3d.cloneUniforms(shader.uniforms);
        var material = this.material = new zen3d.ShaderMaterial(shader.vertexShader, shader.fragmentShader, this.uniforms);
        Object.assign( material.defines, shader.defines ); // copy defines
        var plane = new zen3d.Mesh(geometry, material);
        scene.add(plane);
    }

    ShaderPass.prototype = Object.create(zen3d.Pass.prototype);
    ShaderPass.prototype.constructor = ShaderPass;

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