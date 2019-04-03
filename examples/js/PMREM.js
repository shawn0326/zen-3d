zen3d.PMREM = {
	/**
     * @param  {zen3d.GLCore} glCore
	 * @param  {zen3d.TextureCube} envMap
	 * @param  {Object} [textureOpts]
	 * @param  {number} [textureOpts.width=64]
	 * @param  {number} [textureOpts.height=64]
	 * @param  {number} [textureOpts.type]
	 * @return {zen3d.TextureCube}
	 */
	prefilterEnvironmentMap: function(glCore, envMap, textureOpts) {
		textureOpts = textureOpts || {};

		width = textureOpts.width || 64;
		height = textureOpts.height || 64;

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

		var skyEnv = new zen3d.SkyBox(envMap);
		envMapPass.camera.add(skyEnv);
		dummyScene.add(envMapPass.camera);

		for (var i = 0; i < mipmapNum; i++) {
			// TODO roughness
			// skyEnv.roughness = i / (mipmapNum - 1);
			skyEnv.level = 0;
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

		prefilteredCubeMap.version++;

		return prefilteredCubeMap;
	},
};