(function() {
    /**
     * SpotLightShadow
     * @class
     */
    var SpotLightShadow = function() {
        this.camera = null;

        this.matrix = null;

        // size force to 1024x1024
        this.renderTarget = null;

        this.map = null;

        this.isInit = false;
    }

    /**
     * init
     */
    SpotLightShadow.prototype.init = function(gl) {
        this.camera = new zen3d.Camera();

        this.matrix = new zen3d.Matrix4();

        // size force to 1024x1024
        this.renderTarget = new zen3d.RenderTarget(gl, 1024, 1024);

        this.map = zen3d.Texture2D.createRenderTexture(gl, 1024, 1024);

        this.renderTarget.bind().attachRenderBuffer("depth").bindTexture2D(this.map).unbind();

        this.isInit = true;
    }

    /**
     * update by light
     */
    SpotLightShadow.prototype.update = function(light) {
        this._updateCamera(light);
        this._updateMatrix();
    }

    var _position = new zen3d.Vector3();
    var _quaternion = new zen3d.Quaternion();
    var _scale = new zen3d.Vector3();

    /**
     * update camera matrix by light
     */
    SpotLightShadow.prototype._updateCamera = function(light) {
        var camera = this.camera;

        // decompose light world matrix
        light.worldMatrix.decompose(_position, _quaternion, _scale);

        // copy position
        camera.position.set(_position.x, _position.y, _position.z);

        // copy rotation and doing opposite
        camera.quaternion.set(_quaternion.x, _quaternion.y, _quaternion.z, _quaternion.w);
        camera.euler.y += Math.PI;

        // update view matrix
        camera.updateMatrix(); // just copy matrix to world matrix
        camera.viewMatrix.getInverse(camera.worldMatrix);

        // update projection
        // TODO distance should be custom?
        camera.setPerspective(light.angle * 2, 1, 1, 1000);
    }

    /**
     * update shadow matrix
     */
    SpotLightShadow.prototype._updateMatrix = function() {
        var matrix = this.matrix;
        var camera = this.camera;

        // matrix * 0.5 + 0.5, after identity, range is 0 ~ 1 instead of -1 ~ 1
        matrix.set(
            0.5, 0.0, 0.0, 0.5,
            0.0, 0.5, 0.0, 0.5,
            0.0, 0.0, 0.5, 0.5,
            0.0, 0.0, 0.0, 1.0
        );

        matrix.multiply(camera.projectionMatrix);
        matrix.multiply(camera.viewMatrix);
    }

    zen3d.SpotLightShadow = SpotLightShadow;
})();