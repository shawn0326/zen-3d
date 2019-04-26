(function() {
	/**
     * SkyBox
     * @class
     */
	var SkyBox = function(texture) {
		var geometry = new zen3d.CubeGeometry(1, 1, 1);

		var SkyBoxShader = zen3d.SkyBoxShader;
		if (SkyBoxShader === undefined) {
			console.error("zen3d.SkyBox required zen3d.SkyBoxShader");
		}

		var material = new zen3d.ShaderMaterial(SkyBoxShader);
		material.side = zen3d.DRAW_SIDE.BACK;

		this.material = material;

		if (texture) {
			this.texture = texture;
		}

		zen3d.Mesh.call(this, geometry, material);

		this.frustumCulled = false;
	}

	SkyBox.prototype = Object.create(zen3d.Mesh.prototype);
	SkyBox.prototype.constructor = SkyBox;

	Object.defineProperties(SkyBox.prototype, {
		level: {
			get: function() {
				return this.material.uniforms.level;
			},
			set: function(val) {
				this.material.uniforms.level = val;
			}
		},
		gamma: {
			get: function() {
				return this.material.defines.GAMMA;
			},
			set: function(val) {
				this.material.defines.GAMMA = val;
				this.material.needsUpdate = true;
			}
		},
		texture: {
			get: function() {
				return this.material.diffuseMap || this.material.cubeMap;
			},
			set: function(val) {
				if (val.textureType === zen3d.WEBGL_TEXTURE_TYPE.TEXTURE_CUBE_MAP) {
					this.material.cubeMap = val;
					this.material.defines['PANORAMA'] = false;
				} else {
					this.material.diffuseMap = val;
					this.material.defines['PANORAMA'] = "";
				}
				val.addEventListener("onload", () => this.material.needsUpdate = true);
				this.material.needsUpdate = true;
			}
		}
	});

	zen3d.SkyBox = SkyBox;
})();