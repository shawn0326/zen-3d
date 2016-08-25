(function() {
    /**
     * Camera
     * @class
     */
    var Camera = function() {
        Camera.superClass.constructor.call(this);

        this.type = zen3d.OBJECT_TYPE.CAMERA;

        // view matrix
        this.viewMatrix = new zen3d.Matrix4();

        // projection matrix
        this.projectionMatrix = new zen3d.Matrix4();
    }

    zen3d.inherit(Camera, zen3d.Object3D);

    // TODO how to handle rotation, and how to handle the conflict with lookAt
    // TODO This routine does not support cameras with rotated and/or translated parent(s)

    /**
     * set view by look at
     */
    Camera.prototype.setLookAt = function(target, up) {
        var eye = this.position;

        var zaxis = new zen3d.Vector3();
        eye.subtract(target, zaxis);
        zaxis.normalize();
        var xaxis = new zen3d.Vector3();
        up.crossProduct(zaxis, xaxis);
        xaxis.normalize();
        var yaxis = new zen3d.Vector3();
        zaxis.crossProduct(xaxis, yaxis);

        // TODO why x axis is opposite??
        this.viewMatrix.set(
            -xaxis.x, -xaxis.y, -xaxis.z, -xaxis.dotProduct(eye),
            yaxis.x, yaxis.y, yaxis.z, -yaxis.dotProduct(eye),
            zaxis.x, zaxis.y, zaxis.z, -zaxis.dotProduct(eye),
            0, 0, 0, 1
        );
    }

    /**
     * set orthographic projection matrix
     */
    Camera.prototype.setOrtho = function(left, right, bottom, top, near, far) {
        this.projectionMatrix.set(
            2 / (right - left), 0, 0, -(right + left) / (right - left),
            0, 2 / (top - bottom), 0, -(top + bottom) / (top - bottom),
            0, 0, -2 / (far - near), -(far + near) / (far - near),
            0, 0, 0, 1
        );
    }

    /**
     * set perspective projection matrix
     */
    Camera.prototype.setPerspective = function(fov, aspect, near, far) {
        this.projectionMatrix.set(
            1 / (aspect * Math.tan(fov / 2)), 0, 0, 0,
            0, 1 / (Math.tan(fov / 2)), 0, 0,
            0, 0, -(far + near) / (far - near), -2 * far * near / (far - near),
            0, 0, -1, 0
        );
    }

    zen3d.Camera = Camera;
})();
