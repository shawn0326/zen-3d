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

    var ShaderPostPass = function(shader) {
        var scene = new zen3d.Scene();

        var camera = this.camera = new zen3d.Camera();
        camera.frustumCulled = false;
        camera.position.set(0, 1, 0);
        camera.lookAt(new zen3d.Vector3(0, 0, 0), new zen3d.Vector3(0, 0, -1));
        camera.setOrtho(-1, 1, -1, 1, 0.1, 2);
        scene.add(camera);

        var geometry = new zen3d.PlaneGeometry(2, 2, 1, 1);
        this.uniforms = cloneUniforms(shader.uniforms);
        var material = this.material = new zen3d.ShaderMaterial(shader.vertexShader, shader.fragmentShader, this.uniforms);
        Object.assign( material.defines, shader.defines ); // copy defines
        var plane = new zen3d.Mesh(geometry, material);
        plane.frustumCulled = false;
        scene.add(plane);

        // static scene
        scene.updateMatrix();
        this.renderList = scene.updateRenderList(camera);

        this.renderConfig = {};
    }

    ShaderPostPass.prototype.render = function(glCore) {
        glCore.renderPass(this.renderList.opaque, this.camera, this.renderConfig);
    }

    zen3d.ShaderPostPass = ShaderPostPass;
})();