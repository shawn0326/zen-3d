/**
 * GBuffer
 */

zen3d.GBuffer = (function() {
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

		this._debugPass = new zen3d.ShaderPostPass(GBufferShader.debug);

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
				var material = new zen3d.ShaderMaterial(GBufferShader.MRT);
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
				var material = new zen3d.ShaderMaterial(GBufferShader.normalGlossiness);
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
				var material = new zen3d.ShaderMaterial(GBufferShader.albedoMetalness);
				material.shading = useFlatShading ? zen3d.SHADING_TYPE.FLAT_SHADING : zen3d.SHADING_TYPE.SMOOTH_SHADING;
				material.alphaTest = useDiffuseMap ? 0.999 : 0; // ignore if alpha < 0.99
				this._albedoMetalnessMaterials.set(code, material);
			}

			return this._albedoMetalnessMaterials.get(code);
		}

	});

	var GBufferShader = {

		normalGlossiness: {

			uniforms: {

				roughness: 0.5

			},

			vertexShader: [

				"#include <common_vert>",

				"#define USE_NORMAL",

				"#include <skinning_pars_vert>",
				"#include <normal_pars_vert>",
				"#include <uv_pars_vert>",
				"void main() {",
				"#include <uv_vert>",
				"#include <begin_vert>",
				"#include <skinning_vert>",
				"#include <normal_vert>",
				"#include <pvm_vert>",
				"}"

			].join("\n"),

			fragmentShader: [

				"#include <common_frag>",
				"#include <diffuseMap_pars_frag>",

				"#include <uv_pars_frag>",

				"#define USE_NORMAL",

				"#include <packing>",
				"#include <normal_pars_frag>",

				"uniform float roughness;",

				"#ifdef USE_ROUGHNESSMAP",
				"uniform sampler2D roughnessMap;",
				"#endif",

				"void main() {",
				"#if defined(USE_DIFFUSE_MAP) && defined(ALPHATEST)",
				"vec4 texelColor = texture2D( diffuseMap, v_Uv );",

				"float alpha = texelColor.a * u_Opacity;",
				"if(alpha < ALPHATEST) discard;",
				"#endif",

				"vec3 normal = normalize(v_Normal);",

				"float roughnessFactor = roughness;",
				"#ifdef USE_ROUGHNESSMAP",
				"roughnessFactor *= texture2D( roughnessMap, v_Uv ).g;",
				"#endif",

				"vec4 packedNormalGlossiness;",
				"packedNormalGlossiness.xyz = normal * 0.5 + 0.5;",
				"packedNormalGlossiness.w = clamp(1. - roughnessFactor, 0., 1.);",

				"gl_FragColor = packedNormalGlossiness;",
				"}"

			].join("\n")

		},

		albedoMetalness: {

			uniforms: {

				metalness: 0.5

			},

			vertexShader: [
				"#include <common_vert>",
				"#include <uv_pars_vert>",
				"#include <color_pars_vert>",
				"#include <envMap_pars_vert>",
				"#include <skinning_pars_vert>",
				"void main() {",
				"#include <begin_vert>",
				"#include <skinning_vert>",
				"#include <pvm_vert>",
				"#include <uv_vert>",
				"#include <color_vert>",
				"}"
			].join("\n"),

			fragmentShader: [

				"uniform vec3 u_Color;",
				"uniform float metalness;",

				"#include <uv_pars_frag>",
				"#include <diffuseMap_pars_frag>",

				"#ifdef USE_METALNESSMAP",
				"uniform sampler2D metalnessMap;",
				"#endif",

				"void main() {",

				"vec4 outColor = vec4( u_Color, 1.0 );",
				"#include <diffuseMap_frag>",
				"vec3 diffuseColor = outColor.xyz * outColor.a;",

				"float metalnessFactor = metalness;",
				"#ifdef USE_METALNESSMAP",
				"metalnessFactor *= texture2D( metalnessMap, v_Uv ).b;",
				"#endif",

				"gl_FragColor = vec4( diffuseColor.xyz, metalnessFactor );",

				"}"

			].join("\n")

		},

		MRT: {

			uniforms: {

				roughness: 0.5,
				metalness: 0.5

			},

			vertexShader: [
				"#define USE_NORMAL",
				"#include <common_vert>",
				"#include <uv_pars_vert>",
				"#include <normal_pars_vert>",
				"#include <color_pars_vert>",
				"#include <envMap_pars_vert>",
				"#include <skinning_pars_vert>",
				"void main() {",
				"#include <begin_vert>",
				"#include <skinning_vert>",
				"#include <pvm_vert>",
				"#include <uv_vert>",
				"#include <normal_vert>",
				"#include <color_vert>",
				"}"
			].join("\n"),

			fragmentShader: [

				"#extension GL_EXT_draw_buffers : require",

				"#include <common_frag>",
				"#include <diffuseMap_pars_frag>",

				"#include <uv_pars_frag>",

				"#define USE_NORMAL",

				"#include <packing>",
				"#include <normal_pars_frag>",

				"uniform float roughness;",
				"uniform float metalness;",

				"#ifdef USE_ROUGHNESSMAP",
				"uniform sampler2D roughnessMap;",
				"#endif",

				"#ifdef USE_METALNESSMAP",
				"uniform sampler2D metalnessMap;",
				"#endif",

				"void main() {",
				"vec4 outColor = vec4( u_Color, 1.0 );",
				"#include <diffuseMap_frag>",
				"vec3 diffuseColor = outColor.xyz * outColor.a;",

				"float metalnessFactor = metalness;",
				"#ifdef USE_METALNESSMAP",
				"metalnessFactor *= texture2D( metalnessMap, v_Uv ).b;",
				"#endif",

				"gl_FragData[1] = vec4( outColor.xyz, metalnessFactor );",

				"#if defined(USE_DIFFUSE_MAP) && defined(ALPHATEST)",
				"float alpha = outColor.a * u_Opacity;",
				"if(alpha < ALPHATEST) discard;",
				"#endif",

				"vec3 normal = normalize(v_Normal);",

				"float roughnessFactor = roughness;",
				"#ifdef USE_ROUGHNESSMAP",
				"roughnessFactor *= texture2D( roughnessMap, v_Uv ).g;",
				"#endif",

				"vec4 packedNormalGlossiness;",
				"packedNormalGlossiness.xyz = normal * 0.5 + 0.5;",
				"packedNormalGlossiness.w = clamp(1. - roughnessFactor, 0., 1.);",

				"gl_FragData[0] = packedNormalGlossiness;",
				"}"

			].join("\n")

		},

		debug: {

			uniforms: {

				normalGlossinessTexture: null,
				depthTexture: null,
				albedoMetalnessTexture: null,

				debug: 0,

				viewWidth: 800,
				viewHeight: 600,

				matProjViewInverse: new Float32Array(16)

			},

			vertexShader: [

				"attribute vec3 a_Position;",

				"uniform mat4 u_Projection;",
				"uniform mat4 u_View;",
				"uniform mat4 u_Model;",

				"void main() {",

				"gl_Position = u_Projection * u_View * u_Model * vec4( a_Position, 1.0 );",

				"}"

			].join('\n'),

			fragmentShader: [

				"uniform sampler2D normalGlossinessTexture;",
				"uniform sampler2D depthTexture;",
				"uniform sampler2D albedoMetalnessTexture;",

				// DEBUG
				// - 0: normal
				// - 1: depth
				// - 2: position
				// - 3: glossiness
				// - 4: metalness
				// - 5: albedo
				// - 6: velocity
				"uniform int debug;",

				"uniform float viewHeight;",
				"uniform float viewWidth;",

				"uniform mat4 matProjViewInverse;",

				"void main() {",

				"vec2 texCoord = gl_FragCoord.xy / vec2( viewWidth, viewHeight );",

				"vec4 texel1 = texture2D(normalGlossinessTexture, texCoord);",
				"vec4 texel3 = texture2D(albedoMetalnessTexture, texCoord);",

				// Is empty
				"if (dot(texel1.rgb, vec3(1.0)) == 0.0) {",
				"discard;",
				"}",

				"float glossiness = texel1.a;",
				"float metalness = texel3.a;",

				"vec3 N = texel1.rgb * 2.0 - 1.0;",

				// Depth buffer range is 0.0 - 1.0
				"float z = texture2D(depthTexture, texCoord).r * 2.0 - 1.0;",

				"vec2 xy = texCoord * 2.0 - 1.0;",

				"vec4 projectedPos = vec4(xy, z, 1.0);",
				"vec4 p4 = matProjViewInverse * projectedPos;",

				"vec3 position = p4.xyz / p4.w;",

				"vec3 albedo = texel3.rgb;",

				"vec3 diffuseColor = albedo * (1.0 - metalness);",
				"vec3 specularColor = mix(vec3(0.04), albedo, metalness);",

				"if (debug == 0) {",
				"gl_FragColor = vec4(N, 1.0);",
				"} else if (debug == 1) {",
				"gl_FragColor = vec4(vec3(z), 1.0);",
				"} else if (debug == 2) {",
				"gl_FragColor = vec4(position, 1.0);",
				"} else if (debug == 3) {",
				"gl_FragColor = vec4(vec3(glossiness), 1.0);",
				"} else if (debug == 4) {",
				"gl_FragColor = vec4(vec3(metalness), 1.0);",
				"} else {",
				"gl_FragColor = vec4(albedo, 1.0);",
				"}",

				"}"

			].join('\n')

		}


	};

	return GBuffer;
})();