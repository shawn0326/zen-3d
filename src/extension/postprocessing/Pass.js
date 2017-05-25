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