(function() {
    var BLEND_TYPE = zen3d.BLEND_TYPE;
    var DRAW_MODE = zen3d.DRAW_MODE;
    var Object3D = zen3d.Object3D;
    var Vector3 = zen3d.Vector3;
    var Color3 = zen3d.Color3;
    var Geometry = zen3d.Geometry;
    var InterleavedBuffer = zen3d.InterleavedBuffer;
    var InterleavedBufferAttribute = zen3d.InterleavedBufferAttribute;
    var ShaderMaterial = zen3d.ShaderMaterial;
    
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

    var GPUParticleShader = {

		vertexShader: [

            "const vec4 bitSh = vec4(256. * 256. * 256., 256. * 256., 256., 1.);",
            "const vec4 bitMsk = vec4(0.,vec3(1./256.0));",
            "const vec4 bitShifts = vec4(1.) / bitSh;",
            
            "#define FLOAT_MAX	1.70141184e38",
            "#define FLOAT_MIN	1.17549435e-38",
            
            "lowp vec4 encode_float(highp float v) {",
                "highp float av = abs(v);",
            
                "//Handle special cases",
                "if(av < FLOAT_MIN) {",
                    "return vec4(0.0, 0.0, 0.0, 0.0);",
                "} else if(v > FLOAT_MAX) {",
                    "return vec4(127.0, 128.0, 0.0, 0.0) / 255.0;",
                "} else if(v < -FLOAT_MAX) {",
                    "return vec4(255.0, 128.0, 0.0, 0.0) / 255.0;",
                "}",
            
                "highp vec4 c = vec4(0,0,0,0);",
            
                //Compute exponent and mantissa
                "highp float e = floor(log2(av));",
                "highp float m = av * pow(2.0, -e) - 1.0;",
            
                //Unpack mantissa
                "c[1] = floor(128.0 * m);",
                "m -= c[1] / 128.0;",
                "c[2] = floor(32768.0 * m);",
                "m -= c[2] / 32768.0;",
                "c[3] = floor(8388608.0 * m);",
            
                //Unpack exponent
                "highp float ebias = e + 127.0;",
                "c[0] = floor(ebias / 2.0);",
                "ebias -= c[0] * 2.0;",
                "c[1] += floor(ebias) * 128.0;",
            
                //Unpack sign bit
                "c[0] += 128.0 * step(0.0, -v);",
            
                //Scale back to range
                "return c / 255.0;",
            "}",
            
            "vec4 pack(const in float depth)",
            "{",
                "const vec4 bit_shift = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);",
                "const vec4 bit_mask	= vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);",
                "vec4 res = mod(depth*bit_shift*vec4(255), vec4(256))/vec4(255);",
                "res -= res.xxyz * bit_mask;",
                "return res;",
            "}",
            
            "float unpack(const in vec4 rgba_depth)",
            "{",
                "const vec4 bit_shift = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);",
                "float depth = dot(rgba_depth, bit_shift);",
                "return depth;",
            "}",
            
            "uniform float uTime;",
            "uniform float uScale;",
            "uniform sampler2D tNoise;",
            
            "uniform mat4 u_Projection;",
            "uniform mat4 u_View;",
            "uniform mat4 u_Model;",
            
            "attribute vec4 particlePositionsStartTime;",
            "attribute vec4 particleVelColSizeLife;",
            
            "varying vec4 vColor;",
            "varying float lifeLeft;",
            
            "void main() {",
            
                "// unpack things from our attributes",
                "vColor = encode_float( particleVelColSizeLife.y );",
            
                "// convert our velocity back into a value we can use",
                "vec4 velTurb = encode_float( particleVelColSizeLife.x );",
                "vec3 velocity = vec3( velTurb.xyz );",
                "float turbulence = velTurb.w;",
            
                "vec3 newPosition;",
            
                "float timeElapsed = uTime - particlePositionsStartTime.a;",
            
                "lifeLeft = 1. - (timeElapsed / particleVelColSizeLife.w);",
            
                "gl_PointSize = ( uScale * particleVelColSizeLife.z ) * lifeLeft;",
            
                "velocity.x = ( velocity.x - .5 ) * 3.;",
                "velocity.y = ( velocity.y - .5 ) * 3.;",
                "velocity.z = ( velocity.z - .5 ) * 3.;",
            
                "newPosition = particlePositionsStartTime.xyz + ( velocity * 10. ) * ( uTime - particlePositionsStartTime.a );",
            
                "vec3 noise = texture2D( tNoise, vec2( newPosition.x * .015 + (uTime * .05), newPosition.y * .02 + (uTime * .015) )).rgb;",
                "vec3 noiseVel = ( noise.rgb - .5 ) * 30.;",
            
                "newPosition = mix(newPosition, newPosition + vec3(noiseVel * ( turbulence * 5. ) ), (timeElapsed / particleVelColSizeLife.a) );",
            
                "if( velocity.y > 0. && velocity.y < .05 ) {",
                    "lifeLeft = 0.;",
                "}",
            
                "if( velocity.x < -1.45 ) {",
                    "lifeLeft = 0.;",
                "}",
            
                "if( timeElapsed > 0. ) {",
                    "gl_Position = u_Projection * u_View * u_Model * vec4( newPosition, 1.0 );",
                "} else {",
                    "gl_Position = u_Projection * u_View * u_Model * vec4( particlePositionsStartTime.xyz, 1.0 );",
                    "lifeLeft = 0.;",
                    "gl_PointSize = 0.;",
                "}",
            "}"

		].join( '\n' ),

		fragmentShader: [

            "float scaleLinear(float value, vec2 valueDomain) {",
                "return (value - valueDomain.x) / (valueDomain.y - valueDomain.x);",
            "}",
            
            "float scaleLinear(float value, vec2 valueDomain, vec2 valueRange) {",
                "return mix(valueRange.x, valueRange.y, scaleLinear(value, valueDomain));",
            "}",
            
            "varying vec4 vColor;",
            "varying float lifeLeft;",
            
            "uniform sampler2D tSprite;",
            
            "void main() {",
            
                "float alpha = 0.;",
            
                "if( lifeLeft > .995 ) {",
                    "alpha = scaleLinear( lifeLeft, vec2(1., .995), vec2(0., 1.));",
                    "//mix( 0., 1., ( lifeLeft - .95 ) * 100. ) * .75;",
                "} else {",
                    "alpha = lifeLeft * .75;",
                "}",
            
                "vec4 tex = texture2D( tSprite, gl_PointCoord );",
            
                "gl_FragColor = vec4( vColor.rgb * tex.a, alpha * tex.a );",
            "}"

		].join( '\n' )

	};
    
    /*
     * a particle container
     * reference three.js - flimshaw - Charlie Hoey - http://charliehoey.com
     */
    function ParticleContainer(options) {
        Object3D.call(this);
    
        var options = options || {};
    
        this.maxParticleCount = options.maxParticleCount || 10000;
        this.particleNoiseTex = options.particleNoiseTex || null;
        this.particleSpriteTex = options.particleSpriteTex || null;
    
        this.geometry = new Geometry();
    
        var vertices = [];
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
        var buffer = new InterleavedBuffer(new Float32Array(vertices), 8);
        buffer.dynamic = true;
        var attribute;
        attribute = new InterleavedBufferAttribute(buffer, 3, 0);
        this.geometry.addAttribute("a_Position", attribute);
        attribute = new InterleavedBufferAttribute(buffer, 4, 0);
        this.geometry.addAttribute("particlePositionsStartTime", attribute);
        attribute = new InterleavedBufferAttribute(buffer, 4, 4);
        this.geometry.addAttribute("particleVelColSizeLife", attribute);
    
        this.particleCursor = 0;
    
        this.material = new ShaderMaterial(
            GPUParticleShader.vertexShader, 
            GPUParticleShader.fragmentShader, 
            {
                tSprite: this.particleSpriteTex,
                tNoise: this.particleNoiseTex,
                uTime: 0,
                uScale: 1
            }
        );
        this.material.transparent = true;
        this.material.blending = BLEND_TYPE.ADD;
        this.material.depthTest = true;
        this.material.depthWrite = false;
        this.material.drawMode = DRAW_MODE.POINTS;
        
        this.frustumCulled = false;
    }
    
    ParticleContainer.prototype = Object.assign(Object.create(Object3D.prototype), {
    
        constructor: ParticleContainer,
    
        spawn: function() {
    
            var position = new Vector3();
            var velocity = new Vector3();
            var positionRandomness = 0;
            var velocityRandomness = 0;
            var color = new Color3();
            var colorRandomness = 0;
            var turbulence = 0;
            var lifetime = 0;
            var size = 0;
            var sizeRandomness = 0;
            var smoothPosition = false;
    
            var maxVel = 2;
            var maxSource = 250;
    
            return function spawn(options) {
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
                var particlePositionsStartTimeAttribute = this.geometry.getAttribute("particlePositionsStartTime");
                var buffer = particlePositionsStartTimeAttribute.data;
                var vertices = buffer.array;
                var vertexSize = buffer.stride;
        
                vertices[cursor * vertexSize + 0] = position.x + (Math.random() - 0.5) * positionRandomness; //x
                vertices[cursor * vertexSize + 1] = position.y + (Math.random() - 0.5) * positionRandomness; //y
                vertices[cursor * vertexSize + 2] = position.z + (Math.random() - 0.5) * positionRandomness; //z
                vertices[cursor * vertexSize + 3] = this.material.uniforms.uTime + (Math.random() - 0.5) * 2e-2; //startTime
        
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
                    buffer.version++;
                    buffer.updateRange.offset = 0;
                    buffer.updateRange.count = -1;
                } else {
                    buffer.version++;
                    if(buffer.updateRange.count > -1) {
                        buffer.updateRange.count = this.particleCursor * vertexSize - buffer.updateRange.offset;
                    } else {
                        buffer.updateRange.offset = cursor * vertexSize;
                        buffer.updateRange.count = vertexSize;
                    }
                }
            }
            
        }(),
    
        update: function(time) {
            this.material.uniforms.uTime = time;
        }
    
    });
    
    zen3d.ParticleContainer = ParticleContainer;
})();