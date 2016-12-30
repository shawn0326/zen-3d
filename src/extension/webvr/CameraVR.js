(function() {
    var CameraVR = function() {
        CameraVR.superClass.constructor.call(this);

        this.type = zen3d.OBJECT_TYPE.CAMERA;

        this.cameraL = new zen3d.Camera();
        this.cameraR = new zen3d.Camera();

        this.near = 1;
        this.far = 1000;
    }

    zen3d.inherit(CameraVR, zen3d.Object3D);

    zen3d.CameraVR = CameraVR;
})();