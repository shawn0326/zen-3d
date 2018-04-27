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

        this.glCore.render(scene, cameraL, true);
        this.glCore.render(scene, cameraR, true);

        if (!!renderTarget.texture) {
            this.glCore.texture.updateRenderTargetMipmap(renderTarget);
        }

        vrDisplay.submitFrame();
    }

    zen3d.RendererVR = RendererVR;
})();