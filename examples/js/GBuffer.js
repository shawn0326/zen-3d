(function() {
	var debugTypes = {
		normal: 0,
		depth: 1,
		position: 2,
		glossiness: 3,
		metalness: 4,
		albedo: 5
	};

	var helpMatrix4 = new zen3d.Matrix4();

	function GBuffer(width, height) {
		this._renderTarget1 = new zen3d.RenderTarget2D(width, height);
		this._renderTarget1.texture.minFilter = zen3d.WEBGL_TEXTURE_FILTER.NEAREST;
		this._renderTarget1.texture.magFilter = zen3d.WEBGL_TEXTURE_FILTER.NEAREST;
		this._renderTarget1.texture.type = zen3d.WEBGL_PIXEL_TYPE.HALF_FLOAT;
		this._renderTarget1.texture.generateMipmaps = false;

		this._depthTexture = new zen3d.Texture2D();
		this._depthTexture.image = { data: null, width: 4, height: 4 };
		this._depthTexture.type = zen3d.WEBGL_PIXEL_TYPE.UNSIGNED_INT_24_8; // higher precision for depth
		this._depthTexture.format = zen3d.WEBGL_PIXEL_FORMAT.DEPTH_STENCIL;
		this._depthTexture.magFilter = zen3d.WEBGL_TEXTURE_FILTER.NEAREST;
		this._depthTexture.minFilter = zen3d.WEBGL_TEXTURE_FILTER.NEAREST;
		this._depthTexture.generateMipmaps = false;
		this._depthTexture.flipY = false;
		this._renderTarget1.attach(
			this._depthTexture,
			zen3d.ATTACHMENT.DEPTH_STENCIL_ATTACHMENT
		);

		this._texture2 = new zen3d.Texture2D();
		this._texture2.minFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;
		this._texture2.magFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;
		this._texture2.generateMipmaps = false;

		this._useMRT = false;

		this._renderTarget2 = new zen3d.RenderTarget2D(width, height);
		this._renderTarget2.texture.minFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;
		this._renderTarget2.texture.magFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;
		this._renderTarget2.texture.generateMipmaps = false;

		this._normalGlossinessMaterials = new Map();
		this._albedoMetalnessMaterials = new Map();
		this._MRTMaterials = new Map();

		this._debugPass = new zen3d.ShaderPostPass(zen3d.GBufferShader.debug);

		this.enableNormalGlossiness = true;

		this.enableAlbedoMetalness = true;
	}

	Object.assign(GBuffer.prototype, {

		/**
         * Set G Buffer size.
         * @param {number} width
         * @param {number} height
         */
		resize: function(width, height) {
			this._renderTarget1.resize(width, height);
			this._renderTarget2.resize(width, height);
		},

		update: function(glCore, scene, camera) {
			var renderList = scene.getRenderList(camera);
			var that = this;

			// Use MRT if support
			if (glCore.capabilities.version >= 2 || glCore.capabilities.getExtension('WEBGL_draw_buffers')) {
				if (!this._useMRT) {
					this._useMRT = true;

					if (glCore.capabilities.version >= 2) {
						var ext = glCore.capabilities.getExtension("EXT_color_buffer_float");
						if (ext) {
							this._renderTarget1.texture.internalformat = zen3d.WEBGL_PIXEL_FORMAT.RGBA32F;
							this._renderTarget1.texture.type = zen3d.WEBGL_PIXEL_TYPE.FLOAT;
							// this._renderTarget1.texture.internalformat = zen3d.WEBGL_PIXEL_FORMAT.RGBA16F;
							// this._renderTarget1.texture.type = zen3d.WEBGL_PIXEL_TYPE.HALF_FLOAT;
						} else {
							this._renderTarget1.texture.type = zen3d.WEBGL_PIXEL_TYPE.UNSIGNED_BYTE;
						}

						this._depthTexture.internalformat = zen3d.WEBGL_PIXEL_FORMAT.DEPTH24_STENCIL8;
						this._depthTexture.type = zen3d.WEBGL_PIXEL_TYPE.UNSIGNED_INT_24_8;

						// this._depthTexture.internalformat = zen3d.WEBGL_PIXEL_FORMAT.DEPTH32F_STENCIL8;
						// this._depthTexture.type = zen3d.WEBGL_PIXEL_TYPE.FLOAT_32_UNSIGNED_INT_24_8_REV;
					}

					this._renderTarget1.attach(
						this._texture2,
						zen3d.ATTACHMENT.COLOR_ATTACHMENT1
					);
				}

				glCore.renderTarget.setRenderTarget(this._renderTarget1);

				glCore.state.colorBuffer.setClear(0, 0, 0, 0);
				glCore.clear(true, true, true);

				glCore.renderPass(renderList.opaque, camera, {
					scene: scene,
					getMaterial: function(renderable) {
						var mrtMaterial = that._getMrtMaterial(renderable);

						mrtMaterial.diffuse.copy(renderable.material.diffuse);
						mrtMaterial.diffuseMap = renderable.material.diffuseMap;
						mrtMaterial.uniforms["roughness"] = renderable.material.roughness !== undefined ? renderable.material.roughness : 0.5;
						mrtMaterial.roughnessMap = renderable.material.roughnessMap;
						mrtMaterial.uniforms["metalness"] = renderable.material.metalness !== undefined ? renderable.material.metalness : 0.5;
						mrtMaterial.metalnessMap = renderable.material.metalnessMap;

						return mrtMaterial;
					},
					ifRender: function(renderable) {
						return !!renderable.geometry.getAttribute("a_Normal");
					}
				});

				return;
			}

			// render normalDepthRenderTarget

			if (this.enableNormalGlossiness) {
				glCore.renderTarget.setRenderTarget(this._renderTarget1);

				glCore.state.colorBuffer.setClear(0, 0, 0, 0);
				glCore.clear(true, true, true);

				glCore.renderPass(renderList.opaque, camera, {
					scene: scene,
					getMaterial: function(renderable) {
						var normalGlossinessMaterial = that._getNormalGlossinessMaterial(renderable);

						normalGlossinessMaterial.diffuseMap = renderable.material.diffuseMap;
						normalGlossinessMaterial.uniforms["roughness"] = renderable.material.roughness !== undefined ? renderable.material.roughness : 0.5;
						normalGlossinessMaterial.roughnessMap = renderable.material.roughnessMap;

						return normalGlossinessMaterial;
					},
					ifRender: function(renderable) {
						return !!renderable.geometry.getAttribute("a_Normal");
					}
				});
			}

			// render albedoMetalnessRenderTarget

			if (this.enableAlbedoMetalness) {
				glCore.renderTarget.setRenderTarget(this._renderTarget2);

				glCore.state.colorBuffer.setClear(0, 0, 0, 0);
				glCore.clear(true, true, true);

				glCore.renderPass(renderList.opaque, camera, {
					scene: scene,
					getMaterial: function(renderable) {
						var albedoMetalnessMaterial = that._getAlbedoMetalnessMaterial(renderable);

						albedoMetalnessMaterial.diffuse.copy(renderable.material.diffuse);
						albedoMetalnessMaterial.diffuseMap = renderable.material.diffuseMap;
						albedoMetalnessMaterial.uniforms["metalness"] = renderable.material.metalness !== undefined ? renderable.material.metalness : 0.5;
						albedoMetalnessMaterial.metalnessMap = renderable.material.metalnessMap;

						return albedoMetalnessMaterial;
					},
					ifRender: function(renderable) {
						return !!renderable.geometry.getAttribute("a_Normal");
					}
				});
			}
		},

		/**
         * Debug output of gBuffer. Use `type` parameter to choos the debug output type, which can be:
         *
         * + 'normal'
         * + 'depth'
         * + 'position'
         * + 'glossiness'
         * + 'metalness'
         * + 'albedo'
         *
         * @param {zen3d.GLCore} renderer
         * @param {zen3d.Camera} camera
         * @param {string} [type='normal']
         */
		renderDebug: function(glCore, camera, type) {
			this._debugPass.uniforms["normalGlossinessTexture"] = this.getNormalGlossinessTexture();
			this._debugPass.uniforms["depthTexture"] = this.getDepthTexture();
			this._debugPass.uniforms["albedoMetalnessTexture"] = this.getAlbedoMetalnessTexture();
			this._debugPass.uniforms["debug"] = debugTypes[type] || 0;
			this._debugPass.uniforms["viewWidth"] = glCore.state.currentRenderTarget.width;
			this._debugPass.uniforms["viewHeight"] = glCore.state.currentRenderTarget.height;
			helpMatrix4.multiplyMatrices(camera.projectionMatrix, camera.viewMatrix).inverse();
			this._debugPass.uniforms["matProjViewInverse"].set(helpMatrix4.elements);
			this._debugPass.render(glCore);
		},

		/**
         * Get normal glossiness texture.
         * Channel storage:
         * + R: normal.x * 0.5 + 0.5
         * + G: normal.y * 0.5 + 0.5
         * + B: normal.z * 0.5 + 0.5
         * + A: glossiness
         * @return {zen3d.Texture2D}
         */
		getNormalGlossinessTexture: function() {
			return this._renderTarget1.texture;
		},

		/**
         * Get depth texture.
         * Channel storage:
         * + R: depth
         * @return {zen3d.TextureDepth}
         */
		getDepthTexture: function() {
			return this._depthTexture;
		},

		/**
         * Get albedo metalness texture.
         * Channel storage:
         * + R: albedo.r
         * + G: albedo.g
         * + B: albedo.b
         * + A: metalness
         * @return {zen3d.Texture2D}
         */
		getAlbedoMetalnessTexture: function() {
			return this._useMRT ? this._texture2 : this._renderTarget2.texture;
		},

		dispose: function() {
			this._renderTarget1.dispose();
			this._renderTarget2.dispose();

			this._depthTexture.dispose();
			this._texture2.dispose();

			this._MRTMaterials.forEach(material => material.dispose());
			this._normalGlossinessMaterials.forEach(material => material.dispose());
			this._albedoMetalnessMaterials.forEach(material => material.dispose());

			this._MRTMaterials.clear();
			this._normalGlossinessMaterials.clear();
			this._albedoMetalnessMaterials.clear();
		},

		// get materials from cache
		// Avoid frequently updating materials

		_getMrtMaterial: function(renderable) {
			var useFlatShading = !renderable.geometry.attributes["a_Normal"];
			var useDiffuseMap = renderable.material.diffuseMap;
			var useRoughnessMap = !!renderable.material.roughnessMap;
			var useMetalnessMap = !!renderable.material.metalnessMap;

			var code = useFlatShading + "_" + useDiffuseMap + "_" + useRoughnessMap + "_" + useMetalnessMap;
			if (!this._MRTMaterials.has(code)) {
				var material = new zen3d.ShaderMaterial(zen3d.GBufferShader.MRT);
				material.shading = useFlatShading ? zen3d.SHADING_TYPE.FLAT_SHADING : zen3d.SHADING_TYPE.SMOOTH_SHADING;
				material.alphaTest = useDiffuseMap ? 0.999 : 0; // ignore if alpha < 0.99
				this._MRTMaterials.set(code, material);
			}

			return this._MRTMaterials.get(code);
		},

		_getNormalGlossinessMaterial: function(renderable) {
			var useFlatShading = !renderable.geometry.attributes["a_Normal"];
			var useDiffuseMap = renderable.material.diffuseMap;
			var useRoughnessMap = !!renderable.material.roughnessMap;

			var code = useFlatShading + "_" + useDiffuseMap + "_" + useRoughnessMap;
			if (!this._normalGlossinessMaterials.has(code)) {
				var material = new zen3d.ShaderMaterial(zen3d.GBufferShader.normalGlossiness);
				material.shading = useFlatShading ? zen3d.SHADING_TYPE.FLAT_SHADING : zen3d.SHADING_TYPE.SMOOTH_SHADING;
				material.alphaTest = useDiffuseMap ? 0.999 : 0; // ignore if alpha < 0.99
				this._normalGlossinessMaterials.set(code, material);
			}

			return this._normalGlossinessMaterials.get(code);
		},

		_getAlbedoMetalnessMaterial: function(renderable) {
			var useFlatShading = !renderable.geometry.attributes["a_Normal"];
			var useDiffuseMap = renderable.material.diffuseMap;
			var useMetalnessMap = !!renderable.material.metalnessMap;

			var code = useFlatShading + "_" + useDiffuseMap + "_" + useMetalnessMap;
			if (!this._albedoMetalnessMaterials.has(code)) {
				var material = new zen3d.ShaderMaterial(zen3d.GBufferShader.albedoMetalness);
				material.shading = useFlatShading ? zen3d.SHADING_TYPE.FLAT_SHADING : zen3d.SHADING_TYPE.SMOOTH_SHADING;
				material.alphaTest = useDiffuseMap ? 0.999 : 0; // ignore if alpha < 0.99
				this._albedoMetalnessMaterials.set(code, material);
			}

			return this._albedoMetalnessMaterials.get(code);
		}

	});

	zen3d.GBuffer = GBuffer;
})();