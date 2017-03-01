(function() {

    // construct a couple small arrays used for packing variables into floats etc
	var UINT8_VIEW = new Uint8Array(4);
	var FLOAT_VIEW = new Float32Array(UINT8_VIEW.buffer);

	function decodeFloat(x, y, z, w) {
		UINT8_VIEW[0] = Math.floor(w);
		UINT8_VIEW[1] = Math.floor(z);
		UINT8_VIEW[2] = Math.floor(y);
		UINT8_VIEW[3] = Math.floor(x);
		return FLOAT_VIEW[0];
	}

	/*
	 * a particle container
	 * reference three.js - flimshaw - Charlie Hoey - http://charliehoey.com
	 */
    var ParticleContainer = function(options) {
        ParticleContainer.superClass.constructor.call(this);

        var options = options || {};

        this.maxParticleCount = options.maxParticleCount || 10000;
        this.particleNoiseTex = options.particleNoiseTex || null;
        this.particleSpriteTex = options.particleSpriteTex || null;

        this.geometry = new zen3d.Geometry();
        var vertices = this.geometry.verticesArray = [];
        for(var i = 0; i < this.maxParticleCount; i++) {
            vertices[i * 8 + 0] = 100                        ; //x
            vertices[i * 8 + 1] = 0                          ; //y
            vertices[i * 8 + 2] = 0                          ; //z
            vertices[i * 8 + 3] = 0.0                        ; //startTime
            vertices[i * 8 + 4] = decodeFloat(128, 128, 0, 0); //vel
            vertices[i * 8 + 5] = decodeFloat(0, 254, 0, 254); //color
            vertices[i * 8 + 6] = 1.0                        ; //size
            vertices[i * 8 + 7] = 0.0                        ; //lifespan
        }
        this.geometry.vertexSize = 8;
		this.geometry.vertexFormat = {
            "particlePositionsStartTime": {size: 4, normalized: false, stride: 8, offset: 0},
            "particleVelColSizeLife": {size: 4, normalized: false, stride: 8, offset: 4}
        };
		this.geometry.usageType = zen3d.WEBGL_BUFFER_USAGE.DYNAMIC_DRAW;

        this.particleCursor = 0;
        this.time = 0;

        this.type = zen3d.OBJECT_TYPE.PARTICLE;
    }

    zen3d.inherit(ParticleContainer, zen3d.Object3D);

    var position = new zen3d.Vector3();
    var velocity = new zen3d.Vector3();
    var positionRandomness = 0;
    var velocityRandomness = 0;
    var color = new zen3d.Color3();
	var colorRandomness = 0;
	var turbulence = 0;
	var lifetime = 0;
	var size = 0;
	var sizeRandomness = 0;
	var smoothPosition = false;

    var maxVel = 2;
	var maxSource = 250;

    ParticleContainer.prototype.spawn = function(options) {
        var options = options || {};

        position = options.position !== undefined ? position.copy(options.position) : position.set(0., 0., 0.);
        velocity = options.velocity !== undefined ? velocity.copy(options.velocity) : velocity.set(0., 0., 0.);
        positionRandomness = options.positionRandomness !== undefined ? options.positionRandomness : 0.0;
        velocityRandomness = options.velocityRandomness !== undefined ? options.velocityRandomness : 0.0;
        color = options.color !== undefined ? color.copy(options.color) : color.setRGB(1, 1, 1);
		colorRandomness = options.colorRandomness !== undefined ? options.colorRandomness : 1.0;
		turbulence = options.turbulence !== undefined ? options.turbulence : 1.0;
		lifetime = options.lifetime !== undefined ? options.lifetime : 5.0;
		size = options.size !== undefined ? options.size : 10;
		sizeRandomness = options.sizeRandomness !== undefined ? options.sizeRandomness : 0.0;

        var cursor = this.particleCursor;
        var vertices = this.geometry.verticesArray;
        var vertexSize = this.geometry.vertexSize;

        vertices[cursor * vertexSize + 0] = position.x + (Math.random() - 0.5) * positionRandomness; //x
        vertices[cursor * vertexSize + 1] = position.y + (Math.random() - 0.5) * positionRandomness; //y
        vertices[cursor * vertexSize + 2] = position.z + (Math.random() - 0.5) * positionRandomness; //z
        vertices[cursor * vertexSize + 3] = this.time + (Math.random() - 0.5) * 2e-2; //startTime

        var velX = velocity.x + (Math.random() - 0.5) * velocityRandomness;
        var velY = velocity.y + (Math.random() - 0.5) * velocityRandomness;
        var velZ = velocity.z + (Math.random() - 0.5) * velocityRandomness;

        // convert turbulence rating to something we can pack into a vec4
		var turbulence = Math.floor(turbulence * 254);

        // clamp our value to between 0. and 1.
		velX = Math.floor(maxSource * ((velX - -maxVel) / (maxVel - -maxVel)));
		velY = Math.floor(maxSource * ((velY - -maxVel) / (maxVel - -maxVel)));
		velZ = Math.floor(maxSource * ((velZ - -maxVel) / (maxVel - -maxVel)));

        vertices[cursor * vertexSize + 4] = decodeFloat(velX, velY, velZ, turbulence); //velocity

        var r = color.r * 254 + (Math.random() - 0.5) * colorRandomness * 254;
        var g = color.g * 254 + (Math.random() - 0.5) * colorRandomness * 254;
        var b = color.b * 254 + (Math.random() - 0.5) * colorRandomness * 254;
        if(r > 254) r = 254;
        if(r < 0) r = 0;
        if(g > 254) g = 254;
        if(g < 0) g = 0;
        if(b > 254) b = 254;
        if(b < 0) b = 0;
        vertices[cursor * vertexSize + 5] = decodeFloat(r, g, b, 254); //color

        vertices[cursor * vertexSize + 6] = size + (Math.random() - 0.5) * sizeRandomness; //size

        vertices[cursor * vertexSize + 7] = lifetime; //lifespan

        this.particleCursor++;

        if(this.particleCursor >= this.maxParticleCount) {
            this.particleCursor = 0;
			this.geometry.dirty = true;
			this.geometry.dirtyRange.enable = false;
			this.geometry.dirtyRange.start = 0;
			this.geometry.dirtyRange.count = 0;
        } else {
			this.geometry.dirty = true;
			if(this.geometry.dirtyRange.enable) {
				this.geometry.dirtyRange.count = this.particleCursor * vertexSize - this.geometry.dirtyRange.start;
			} else {
				this.geometry.dirtyRange.enable = true;
				this.geometry.dirtyRange.start = cursor * vertexSize;
				this.geometry.dirtyRange.count = vertexSize;
			}

		}


    }

    ParticleContainer.prototype.update = function(time) {
        this.time = time;
    }

	zen3d.ParticleContainer = ParticleContainer;
})();