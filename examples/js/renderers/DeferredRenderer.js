(function() {
	function DeferredRenderer(view, options) {
		var defaultContextParams = {
			antialias: true, // antialias
			alpha: false, // effect performance, default false
			// premultipliedAlpha: false, // effect performance, default false
			stencil: true
		};

		var gl = view.getContext("webgl2", options || defaultContextParams) || view.getContext("webgl", options || defaultContextParams);
		this.glCore = new zen3d.WebGLCore(gl);

		console.info("DeferredRenderer use WebGL Version: " + this.glCore.capabilities.version);

		this.shadowMapPass = new zen3d.ShadowMapPass();

		this.backRenderTarget = new zen3d.RenderTargetBack(view);

		var width = this.backRenderTarget.width;
		var height = this.backRenderTarget.height;

		this.gBuffer = new zen3d.GBuffer(width, height);

		var directionalLightPass = new zen3d.ShaderPostPass(zen3d.DeferredShader2.directionalLight);
		directionalLightPass.material.transparent = true;
		directionalLightPass.material.blending = zen3d.BLEND_TYPE.ADD;
		directionalLightPass.material.depthWrite = false;
		directionalLightPass.material.depthTest = false;
		this.directionalLightPass = directionalLightPass;

		var pointLightPass = new zen3d.ShaderPostPass(zen3d.DeferredShader2.pointLight);
		pointLightPass.material.transparent = true;
		pointLightPass.material.blending = zen3d.BLEND_TYPE.ADD;
		pointLightPass.material.depthWrite = false;
		pointLightPass.material.depthTest = false;
		this.pointLightPass = pointLightPass;

		var spotLightPass = new zen3d.ShaderPostPass(zen3d.DeferredShader2.spotLight);
		spotLightPass.material.transparent = true;
		spotLightPass.material.blending = zen3d.BLEND_TYPE.ADD;
		spotLightPass.material.depthWrite = false;
		spotLightPass.material.depthTest = false;
		this.spotLightPass = spotLightPass;

		var ambientCubemapLightPass = new zen3d.ShaderPostPass(zen3d.DeferredShader2.ambientCubemapLight);
		ambientCubemapLightPass.material.transparent = true;
		ambientCubemapLightPass.material.blending = zen3d.BLEND_TYPE.ADD;
		ambientCubemapLightPass.material.depthWrite = false;
		ambientCubemapLightPass.material.depthTest = false;
		this.ambientCubemapLightPass = ambientCubemapLightPass;

		this.ambientCubemap = null;
		this.ambientCubemapIntensity = 1.0;
	}

	var matProjViewInverse = new zen3d.Matrix4();
	var eyePosition = new zen3d.Vector3();

	Object.assign(DeferredRenderer.prototype, {

		resize: function(width, height) {
			this.backRenderTarget.resize(width, height);
			this.gBuffer.resize(width, height);
		},

		render: function(scene, camera, renderTarget) {
			var glCore = this.glCore;
			var gBuffer = this.gBuffer;
			var width = this.backRenderTarget.width;
			var height = this.backRenderTarget.height;

			scene.updateMatrix();
			scene.updateLights();

			this.shadowMapPass.render(glCore, scene);

			scene.updateRenderList(camera);

			// Step 1: update GBuffer
			gBuffer.update(glCore, scene, camera);

			// Step 2: light accum

			glCore.renderTarget.setRenderTarget(renderTarget || this.backRenderTarget);

			glCore.state.colorBuffer.setClear(0, 0, 0, 0);
			glCore.clear(true, true, true);

			matProjViewInverse.multiplyMatrices(camera.projectionMatrix, camera.viewMatrix).inverse();
			eyePosition.setFromMatrixPosition(camera.worldMatrix);

			function uploadCommonUniforms(pass) {
				pass.uniforms["normalGlossinessTexture"] = gBuffer.getNormalGlossinessTexture();
				pass.uniforms["depthTexture"] = gBuffer.getDepthTexture();
				pass.uniforms["albedoMetalnessTexture"] = gBuffer.getAlbedoMetalnessTexture();
				pass.uniforms["windowSize"][0] = width;
				pass.uniforms["windowSize"][1] = height;
				pass.uniforms["matProjViewInverse"].set(matProjViewInverse.elements);
				pass.uniforms["eyePosition"][0] = eyePosition.x;
				pass.uniforms["eyePosition"][1] = eyePosition.y;
				pass.uniforms["eyePosition"][2] = eyePosition.z;
			}

			// directional
			var pass = this.directionalLightPass;
			uploadCommonUniforms(pass);

			var lights = scene.lights.directional;
			var count = scene.lights.directsNum;

			for (var i = 0; i < count; i++) {
				var light = lights[i];

				pass.uniforms["lightColor"] = [light.color[0], light.color[1], light.color[2]];
				pass.uniforms["lightDirection"] = [light.direction[0], light.direction[1], light.direction[2]];

				if (light.shadow) {
					pass.material.defines["SHADOW"] = 1;
					pass.uniforms["shadowBias"] = light.shadowBias;
					pass.uniforms["shadowRadius"] = light.shadowRadius;
					pass.uniforms["shadowMapSize"][0] = light.shadowMapSize[0];
					pass.uniforms["shadowMapSize"][1] = light.shadowMapSize[1];

					pass.uniforms["shadowMap"] = scene.lights.directionalShadow[i].depthMap;
					pass.uniforms["shadowMatrix"].set(scene.lights.directionalShadowMatrix, i * 16);
				} else {
					pass.material.defines["SHADOW"] = 0;
				}

				pass.render(glCore);
			}

			// point
			var pass = this.pointLightPass;
			uploadCommonUniforms(pass);

			var lights = scene.lights.point;
			var count = scene.lights.pointsNum;

			for (var i = 0; i < count; i++) {
				var light = lights[i];

				pass.uniforms["lightColor"] = [light.color[0], light.color[1], light.color[2]];
				pass.uniforms["lightPosition"] = [light.position[0], light.position[1], light.position[2]];
				pass.uniforms["lightRange"] = light.distance;
				// pass.uniforms["attenuationFactor"] = light.decay; 5.0?

				if (light.shadow) {
					pass.material.defines["SHADOW"] = 1;
					pass.uniforms["shadowBias"] = light.shadowBias;
					pass.uniforms["shadowRadius"] = light.shadowRadius;
					pass.uniforms["shadowMapSize"][0] = light.shadowMapSize[0];
					pass.uniforms["shadowMapSize"][1] = light.shadowMapSize[1];

					pass.uniforms["shadowMap"] = scene.lights.pointShadow[i].depthMap;

					pass.uniforms["shadowCameraNear"] = light.shadowCameraNear;
					pass.uniforms["shadowCameraFar"] = light.shadowCameraFar;
				} else {
					pass.material.defines["SHADOW"] = 0;
				}

				pass.render(glCore);
			}

			// spot
			var pass = this.spotLightPass;
			uploadCommonUniforms(pass);

			var lights = scene.lights.spot;
			var count = scene.lights.spotsNum;

			for (var i = 0; i < count; i++) {
				var light = lights[i];

				pass.uniforms["lightColor"] = [light.color[0], light.color[1], light.color[2]];
				pass.uniforms["lightPosition"] = [light.position[0], light.position[1], light.position[2]];
				pass.uniforms["lightDirection"] = [light.direction[0], light.direction[1], light.direction[2]];
				pass.uniforms["lightConeCos"] = light.coneCos;
				pass.uniforms["lightPenumbraCos"] = light.penumbraCos;
				pass.uniforms["lightRange"] = light.distance;
				// pass.uniforms["attenuationFactor"] = light.decay; 5.0?

				if (light.shadow) {
					pass.material.defines["SHADOW"] = 1;
					pass.uniforms["shadowBias"] = light.shadowBias;
					pass.uniforms["shadowRadius"] = light.shadowRadius;
					pass.uniforms["shadowMapSize"][0] = light.shadowMapSize[0];
					pass.uniforms["shadowMapSize"][1] = light.shadowMapSize[1];

					pass.uniforms["shadowMap"] = scene.lights.spotShadow[i].depthMap;
					pass.uniforms["shadowMatrix"].set(scene.lights.spotShadowMatrix, i * 16);
				} else {
					pass.material.defines["SHADOW"] = 0;
				}

				pass.render(glCore);
			}

			// ambientCubemap

			if (this.ambientCubemap) {
				var pass = this.ambientCubemapLightPass;
				uploadCommonUniforms(pass);

				pass.uniforms["cubeMap"] = this.ambientCubemap;
				pass.uniforms["intensity"] = this.ambientCubemapIntensity;

				pass.render(glCore);
			}
		}

	});

	zen3d.DeferredRenderer = DeferredRenderer;
})();