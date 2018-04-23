(function() {
    var CameraVR = function() {
        CameraVR.superClass.constructor.call(this);

        this.type = zen3d.OBJECT_TYPE.CAMERA;

        this.cameraL = new zen3d.Camera();
        this.cameraR = new zen3d.Camera();

        this.cameraL.rect.set(0, 0, 0.5, 1);
        this.cameraR.rect.set(0.5, 0, 1, 1);

        this.near = 1;
        this.far = 1000;
    }

    zen3d.inherit(CameraVR, zen3d.Object3D);

    Object.defineProperties(CameraVR.prototype, {
        gammaFactor: {
            get: function() {
                return this.cameraL.gammaFactor;
            },
            set: function(value) {
                this.cameraL.gammaFactor = value;
                this.cameraR.gammaFactor = value;
            }
        },
        gammaInput: {
            get: function() {
                return this.cameraL.gammaInput;
            },
            set: function(value) {
                this.cameraL.gammaInput = value;
                this.cameraR.gammaInput = value;
            }
        },
        gammaOutput: {
            get: function() {
                return this.cameraL.gammaOutput;
            },
            set: function(value) {
                this.cameraL.gammaOutput = value;
                this.cameraR.gammaOutput = value;
            }
        }
    });

    zen3d.CameraVR = CameraVR;
})();