/**
 * prefilter EnvironmentMap
 * http://holger.dammertz.org/stuff/notes_HammersleyOnHemisphere.html
 */

zen3d.PMREM = (function() {
	var prefilterShader = {

		defines: {
			SAMPLE_NUMBER: 1024
		},

		uniforms: {
			environmentMap: null,
			normalDistribution: null,
			roughness: 0.5
		},

		vertexShader: `
			#include <common_vert>
			varying vec3 v_ModelPos;
			void main() {
				v_ModelPos = (u_Model * vec4(a_Position, 0.0)).xyz;
				gl_Position = u_Projection * u_View * u_Model * vec4(a_Position, 1.0);
				gl_Position.z = gl_Position.w; // set z to camera.far
			}
		`,

		fragmentShader: `
			#include <common_frag>
			uniform samplerCube environmentMap;
			uniform sampler2D normalDistribution;
			uniform float roughness;
			varying vec3 v_ModelPos;

			vec3 importanceSampleNormal(float i, float roughness, vec3 N) {
				vec3 H = texture2D(normalDistribution, vec2(roughness, i)).rgb;
			
				vec3 upVector = abs(N.y) > 0.999 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
				vec3 tangentX = normalize(cross(N, upVector));
				vec3 tangentZ = cross(N, tangentX);
				// Tangent to world space
				return normalize(tangentX * H.x + N * H.y + tangentZ * H.z);
			}

			void main() {
				vec3 V = normalize(v_ModelPos);

				vec3 N = V;

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;
				float fMaxSampleNumber = float(SAMPLE_NUMBER);

				for (int i = 0; i < SAMPLE_NUMBER; i++) {
					vec3 H = importanceSampleNormal(float(i) / fMaxSampleNumber, roughness, N);
					vec3 L = reflect(-V, H);
			
					float NoL = clamp(dot(N, L), 0.0, 1.0);
					if (NoL > 0.0) {
						prefilteredColor += mapTexelToLinear(textureCube(environmentMap, L)).rgb * NoL;
						totalWeight += NoL;
					}
				}

				gl_FragColor = vec4(prefilteredColor / totalWeight, 1.0);
			}
		`

	};

	function generateNormalDistribution(capabilities, roughnessLevels, sampleSize) {
		// GLSL not support bit operation, use lookup instead
		// V -> i / N, U -> roughness
		var roughnessLevels = roughnessLevels || 256;
		var sampleSize = sampleSize || 1024;

		var normalDistribution = new zen3d.Texture2D();

		var pixels = new Float32Array(sampleSize * roughnessLevels * 4);
		normalDistribution.image = { width: roughnessLevels, height: sampleSize, data: pixels };

		normalDistribution.type = zen3d.WEBGL_PIXEL_TYPE.FLOAT;
		if (capabilities.version >= 2) {
			normalDistribution.internalformat = zen3d.WEBGL_PIXEL_FORMAT.RGBA32F;
			normalDistribution.format = zen3d.WEBGL_PIXEL_FORMAT.RGBA;
		}
		normalDistribution.minFilter = zen3d.WEBGL_TEXTURE_FILTER.NEAREST;
		normalDistribution.magFilter = zen3d.WEBGL_TEXTURE_FILTER.NEAREST;
		normalDistribution.generateMipmaps = false;

		var tmp = [];

		// function sortFunc(a, b) {
		//     return Math.abs(b) - Math.abs(a);
		// }
		for (var j = 0; j < roughnessLevels; j++) {
			var roughness = j / roughnessLevels;
			var a = roughness * roughness;

			for (var i = 0; i < sampleSize; i++) {
				// http://holger.dammertz.org/stuff/notes_HammersleyOnHemisphere.html
				// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
				// http://stackoverflow.com/questions/1908492/unsigned-integer-in-javascript
				// http://stackoverflow.com/questions/1822350/what-is-the-javascript-operator-and-how-do-you-use-it
				var y = (i << 16 | i >>> 16) >>> 0;
				y = ((y & 1431655765) << 1 | (y & 2863311530) >>> 1) >>> 0;
				y = ((y & 858993459) << 2 | (y & 3435973836) >>> 2) >>> 0;
				y = ((y & 252645135) << 4 | (y & 4042322160) >>> 4) >>> 0;
				y = (((y & 16711935) << 8 | (y & 4278255360) >>> 8) >>> 0) / 4294967296;

				// CDF
				var cosTheta = Math.sqrt((1 - y) / (1 + (a * a - 1.0) * y));
				tmp[i] = cosTheta;
			}

			for (var i = 0; i < sampleSize; i++) {
				var offset = (i * roughnessLevels + j) * 4;
				var cosTheta = tmp[i];
				var sinTheta = Math.sqrt(1.0 - cosTheta * cosTheta);
				var x = i / sampleSize;
				var phi = 2.0 * Math.PI * x;
				pixels[offset] = sinTheta * Math.cos(phi);
				pixels[offset + 1] = cosTheta;
				pixels[offset + 2] = sinTheta * Math.sin(phi);
				pixels[offset + 3] = 1.0;
			}
		}
		normalDistribution.pixels = pixels;

		normalDistribution.version++;

		return normalDistribution;
	}

	return {
		/**
		 * @param  {zen3d.GLCore} glCore
		 * @param  {zen3d.TextureCube} envMap
		 * @param  {Object} [textureOpts]
		 * @param  {number} [textureOpts.width=64]
		 * @param  {number} [textureOpts.height=64]
		 * @param  {number} [textureOpts.sampleSize=1024]
		 * @param  {number} [textureOpts.type]
		 * @return {zen3d.TextureCube}
		 */
		prefilterEnvironmentMap: function(glCore, envMap, textureOpts) {
			textureOpts = textureOpts || {};

			var width = textureOpts.width || 64;
			var height = textureOpts.height || 64;

			var sampleSize = textureOpts.sampleSize || 1024;

			var textureType = textureOpts.type || envMap.type;
			var ArrayCtor = textureType === zen3d.WEBGL_PIXEL_TYPE.UNSIGNED_BYTE ? Uint8Array : Float32Array;

			var prefilteredCubeMap = new zen3d.TextureCube();
			prefilteredCubeMap.type = textureType;
			prefilteredCubeMap.generateMipmaps = false;

			var target = new zen3d.RenderTargetCube(width, height);
			target.texture.type = textureType;
			target.texture.generateMipmaps = false;

			var size = Math.min(width, height);
			var mipmapNum = Math.log(size) / Math.log(2) + 1;

			var envMapPass = new zen3d.EnvironmentMapPass(target);

			var dummyScene = new zen3d.Scene();

			var geometry = new zen3d.CubeGeometry(1, 1, 1);
			var material = new zen3d.ShaderMaterial(prefilterShader);
			material.side = zen3d.DRAW_SIDE.BACK;
			var skyEnv = new zen3d.Mesh(geometry, material);
			skyEnv.frustumCulled = false;
			material.uniforms.environmentMap = envMap;
			material.uniforms.normalDistribution = generateNormalDistribution(glCore.capabilities, 256, sampleSize);
			envMapPass.camera.add(skyEnv);
			dummyScene.add(envMapPass.camera);

			for (var i = 0; i < mipmapNum; i++) {
				// TODO roughness
				// skyEnv.roughness = i / (mipmapNum - 1);
				material.uniforms.roughness = i / (mipmapNum - 1);
				// skyEnv.level = 0;
				envMapPass.render(glCore, dummyScene);

				prefilteredCubeMap.mipmaps[i] = [];

				for (var j = 0; j < 6; j++) {
					var pixels = new ArrayCtor(target.width * target.height * 4);
					target.activeCubeFace = j;
					glCore.renderTarget.setRenderTarget(target);
					glCore.gl.readPixels(
						0, 0, target.width, target.height,
						zen3d.WEBGL_PIXEL_FORMAT.RGBA, textureType, pixels
					);
					if (i === 0) {
						prefilteredCubeMap.images.push({ width: target.width, height: target.height, data: pixels });
					}
					prefilteredCubeMap.mipmaps[i].push({ width: target.width, height: target.height, data: pixels });
				}

				target.resize(target.width / 2, target.height / 2);
			}

			target.dispose();
			geometry.dispose();
			material.dispose();

			prefilteredCubeMap.version++;

			return prefilteredCubeMap;
		},
	};
})();