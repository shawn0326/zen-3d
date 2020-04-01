/**
 * RendererXR
 */

import {
	Renderer
} from "../../../build/zen3d.module.js";

var RendererXR = (function() {
	var RendererXR = function(view) {
		Renderer.call(this, view, {
			antialias: true, // antialias
			alpha: false, // effect performance, default false
			// premultipliedAlpha: false, // effect performance, default false
			stencil: true,
			xrCompatible: true
		});

		this.session = null;
		this.referenceSpace = null;
		this.frame = null;

		this._currentDepthNear = 0;
		this._currentDepthFar = 0;
	}

	RendererXR.prototype = Object.create(Renderer.prototype);
	RendererXR.prototype.constructor = RendererXR;

	RendererXR.prototype.init = function(type) {
		var gl = this.glCore.gl;
		type = type || 'immersive-vr';

		if (navigator.xr) {
			var sessionInit = { optionalFeatures: ['local-floor', 'bounded-floor'] };

			return navigator.xr.isSessionSupported(type)
				.then(supported => {
					if (supported) {
						return Promise.resolve();
					} else {
						return Promise.reject('WebXR: ' + type + ' is not supported');
					}
				})
				.then(() => {
					return navigator.xr.requestSession(type, sessionInit);
				})
				.then(session => {
					this.session = session;
					var attributes = gl.getContextAttributes();
					var layerInit = {
						antialias: attributes.antialias,
						alpha: attributes.alpha,
						depth: attributes.depth,
						stencil: attributes.stencil,
						framebufferScaleFactor: 1.0
					};
					var baseLayer = new XRWebGLLayer(session, gl, layerInit);
					session.updateRenderState({ baseLayer: baseLayer });
					return session.requestReferenceSpace('local-floor');
				})
				.then(referenceSpace => {
					this.referenceSpace = referenceSpace;
					return Promise.resolve(this.session);
				});
		} else {
			return Promise.reject('xr not exist in navigator');
		}
	}

	RendererXR.prototype.setFrame = function(frame) {
		this.frame = frame;
	}

	RendererXR.prototype.render = function(scene, camera, renderTarget, forceClear) {
		var frame = this.frame;

		var cameraL = camera.cameraL;
		var cameraR = camera.cameraR;

		if (this._currentDepthNear !== camera.near || this._currentDepthFar !== camera.far) {
			// the new renderState won't apply until the next frame
			this.session.updateRenderState({
				depthNear: camera.near,
				depthFar: camera.far
			});
			this._currentDepthNear = camera.near;
			this._currentDepthFar = camera.far;
		}

		var pose = frame.getViewerPose(this.referenceSpace);
		if (pose !== null) {
			var views = pose.views;
			var baseLayer = this.session.renderState.baseLayer;

			// set cameras
			for (var i = 0; i < views.length; i++) {
				var view = views[i];
				var viewport = baseLayer.getViewport(view);

				var _camera = i === 0 ? cameraL : cameraR;
				_camera.matrix.fromArray(view.transform.matrix);
				_camera.matrix.decompose(_camera.position, _camera.quaternion, _camera.scale);
				_camera.position.add(camera.position);
				_camera.updateMatrix();
				_camera.projectionMatrix.fromArray(view.projectionMatrix);
				_camera.projectionMatrixInverse.getInverse(_camera.projectionMatrix);
				var x = viewport.x / this.backRenderTarget.width;
				var y = viewport.y / this.backRenderTarget.height;
				var width = viewport.width / this.backRenderTarget.width;
				var height = viewport.height / this.backRenderTarget.height;
				_camera.rect.set(x, y, x + width, y + height);
			}

			// set framebuffer
			if (renderTarget) {
				this.glCore.renderTarget.setRenderTarget(renderTarget);
			} else {
				this.glCore.renderTarget.setRenderTarget(this.backRenderTarget);
				this.glCore.gl.bindFramebuffer(this.glCore.gl.FRAMEBUFFER, baseLayer.framebuffer);
			}

			this.matrixAutoUpdate && scene.updateMatrix();
			this.lightsAutoupdate && scene.updateLights();

			if (this.shadowAutoUpdate || this.shadowNeedsUpdate) {
				this.shadowMapPass.render(this.glCore, scene);
				this.shadowNeedsUpdate = false;
			}

			if (renderTarget === undefined) {
				renderTarget = this.backRenderTarget;
			}
			this.glCore.renderTarget.setRenderTarget(renderTarget);

			if (this.autoClear || forceClear) {
				this.glCore.clear(true, true, true);
			}

			this.glCore.render(scene, cameraL);
			this.glCore.render(scene, cameraR);

			if (!!renderTarget.texture) {
				this.glCore.renderTarget.updateRenderTargetMipmap(renderTarget);
			}
		}
	}

	return RendererXR;
})();

export { RendererXR };