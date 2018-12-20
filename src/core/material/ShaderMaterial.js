import { MATERIAL_TYPE } from '../const.js';
import { Material } from './Material.js';
import { cloneUniforms } from '../base.js';

/**
 * A material rendered with custom shaders.
 * A shader is a small program written in GLSL that runs on the GPU.
 * @constructor
 * @extends zen3d.Material
 * @memberof zen3d
 * @param {Object} shader - Shader object for the shader material.
 * @param {string} shader.vertexShader -  Vertex shader GLSL code.
 * @param {string} shader.fragmentShader - Fragment shader GLSL code.
 * @param {Object} [shader.defines={}] - Defines of the shader.
 * @param {Object} [shader.uniforms={}] - Uniforms of the shader.
 */
function ShaderMaterial(shader) {

    Material.call(this);

    this.type = MATERIAL_TYPE.SHADER;

    /**
     * Vertex shader GLSL code. This is the actual code for the shader.
     * @type {number}
     * @default ""
     */
    this.vertexShader = shader.vertexShader || "";

    /**
     * Fragment shader GLSL code. This is the actual code for the shader.
     * @type {number}
     * @default ""
     */
    this.fragmentShader = shader.fragmentShader || "";

    /**
     * Defines of the shader
     * @type {Object}
     * @default {}
     */
    this.defines = {};

    // copy defines
    Object.assign(this.defines, shader.defines);

    /**
     * Uniforms of the shader.
     * Uniforms should match with fragment shader
     * @type {Object}
     * @default {}
     */
    this.uniforms = cloneUniforms(shader.uniforms);

}

ShaderMaterial.prototype = Object.assign(Object.create(Material.prototype), /** @lends zen3d.ShaderMaterial.prototype */{

    constructor: ShaderMaterial,

    copy: function(source) {
        Material.prototype.copy.call(this, source);

        this.vertexShader = source.vertexShader;
        this.fragmentShader = source.fragmentShader;

        return this;
    }

});

export { ShaderMaterial };
