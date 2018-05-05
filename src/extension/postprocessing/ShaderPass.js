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
        Object.assign( material.defines, shader.defines ); // copy defines
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