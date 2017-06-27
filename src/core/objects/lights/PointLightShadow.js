(function() {
    /**
     * PointLightShadow
     * @class
     */
    var PointLightShadow = function() {
        this.camera = new zen3d.Camera();

        this.matrix = new zen3d.Matrix4();

        var mapSize = new zen3d.Vector2(512, 512);

        this.renderTarget = new zen3d.RenderTargetCube(mapSize.x, mapSize.y);

        var map = this.renderTarget.texture;
        map.generateMipmaps = false;
        map.minFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;

        this.map = map;
        this.mapSize = mapSize;

        this._targets = [
            new zen3d.Vector3(1, 0, 0), new zen3d.Vector3(-1, 0, 0), new zen3d.Vector3(0, 1, 0),
            new zen3d.Vector3(0, -1, 0), new zen3d.Vector3(0, 0, 1), new zen3d.Vector3(0, 0, -1)
        ];

        this._ups = [
            new zen3d.Vector3(0, -1, 0), new zen3d.Vector3(0, -1, 0), new zen3d.Vector3(0, 0, 1),
            new zen3d.Vector3(0, 0, -1), new zen3d.Vector3(0, -1, 0), new zen3d.Vector3(0, -1, 0)
        ];

        this._lookTarget = new zen3d.Vector3();
    }

    /**
     * update by light
     */
    PointLightShadow.prototype.update = function(light, face) {
        this._updateCamera(light, face);
        this._updateMatrix();

        // TODO check size change, remove this from loop
        if(this.mapSize.x !== this.renderTarget.width || this.mapSize.y !== this.renderTarget.height) {
            this.renderTarget.resize(this.mapSize.x, this.mapSize.y);
        }
    }

    /**
     * update camera matrix by light
     */
    PointLightShadow.prototype._updateCamera = function(light, face) {
        var camera = this.camera;
        var lookTarget = this._lookTarget;
        var targets = this._targets;
        var ups = this._ups;

        // set camera position and lookAt(rotation)
        camera.position.setFromMatrixPosition(light.worldMatrix);
        lookTarget.set(targets[face].x + camera.position.x, targets[face].y + camera.position.y, targets[face].z + camera.position.z);
        camera.setLookAt(lookTarget, ups[face]);

        // update view matrix
        camera.updateMatrix(); // just copy matrix to world matrix
        camera.viewMatrix.getInverse(camera.worldMatrix);

        // update projection
        camera.setPerspective(90 / 180 * Math.PI, 1, 1, 1000);
    }

    /**
     * update shadow matrix
     */
    PointLightShadow.prototype._updateMatrix = function() {
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

    zen3d.PointLightShadow = PointLightShadow;
})();