(function() {
    var RendererVR = function(view) {
        RendererVR.superClass.constructor.call(this, view);

        this.vrDisplay = undefined;

        function gotVRDisplays(displays) {
            if (displays.length > 0) {
                this.vrDisplay = displays[0];
            } else {
                console.warn('HMD not available');
            }
        };

        if (navigator.getVRDisplays) {
            navigator.getVRDisplays().then(gotVRDisplays.bind(this)).catch(function() {
                console.warn('RendererVR: Unable to get VR Displays');
            });
        } else {
            console.warn('getVRDisplays not exist in navigator');
        }

        this.frameData = null;

        if ('VRFrameData' in window) {
            this.frameData = new window.VRFrameData();
        } else {
            console.warn('VRFrameData not exist');
        }
    }

    zen3d.inherit(RendererVR, zen3d.Renderer);

    var viewMatrix = new zen3d.Matrix4();

    RendererVR.prototype.render = function(scene, camera, renderTarget, forceClear) {
        var vrDisplay = this.vrDisplay;
        var frameData = this.frameData;
        var cameraL = camera.cameraL;
        var cameraR = camera.cameraR;

        if (!vrDisplay) {
            return;
        }

        // read from camera
        vrDisplay.depthNear = camera.near;
        vrDisplay.depthFar = camera.far;

        vrDisplay.getFrameData(frameData);

        // set Left Camera
        cameraL.projectionMatrix.elements = frameData.leftProjectionMatrix;
        viewMatrix.elements = frameData.leftViewMatrix;
        viewMatrix.inverse().decompose(cameraL.position, cameraL.quaternion, cameraL.scale);
        cameraL.position.add(camera.position);
        cameraL.updateMatrix();

        // set Right Camera
        cameraR.projectionMatrix.elements = frameData.leftProjectionMatrix;
        viewMatrix.elements = frameData.rightViewMatrix;
        viewMatrix.inverse().decompose(cameraR.position, cameraR.quaternion, cameraR.scale);
        cameraR.position.add(camera.position);
        cameraR.updateMatrix();

        this.matrixAutoUpdate && scene.updateMatrix();
        this.lightsAutoupdate && scene.updateLights();

        if ( this.shadowAutoUpdate || this.shadowNeedsUpdate ) {
            this.shadowMapPass.render(this.glCore, scene);
            this.shadowNeedsUpdate = false;
        }

        if (renderTarget === undefined) {
            renderTarget = this.backRenderTarget;
        }
        this.glCore.texture.setRenderTarget(renderTarget);

        if (this.autoClear || forceClear) {
            this.glCore.state.clearColor(0, 0, 0, 0);
            this.glCore.clear(true, true, true);
        }

        this.forwardPass.render(this.glCore, scene, cameraL);
        this.forwardPass.render(this.glCore, scene, cameraR);

        if (!!renderTarget.texture) {
            this.glCore.texture.updateRenderTargetMipmap(renderTarget);
        }

        vrDisplay.submitFrame();
    }

    zen3d.RendererVR = RendererVR;
})();
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