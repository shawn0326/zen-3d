import {OBJECT_TYPE} from '../../const.js';
import {Object3D} from '../Object3D.js';
import {Vector3} from '../../math/Vector3.js';
import {Color3} from '../../math/Color3.js';
import {Geometry} from '../../geometry/Geometry.js';
import {InterleavedBuffer} from '../../geometry/InterleavedBuffer.js';
import {InterleavedBufferAttribute} from '../../geometry/InterleavedBufferAttribute.js';
import {ParticleMaterial} from '../../material/ParticleMaterial.js';

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
    this.time = 0;

    this.type = OBJECT_TYPE.PARTICLE;

    this.material = new ParticleMaterial();
    
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
        this.time = time;
    }

});

export {ParticleContainer};