import {MATERIAL_TYPE} from '../const.js';
import {Material} from './Material.js';
import {cloneUniforms} from '../base.js';

/**
 * ShaderMaterial
 * @class
 */
function ShaderMaterial(shader) {
    Material.call(this);

    this.type = MATERIAL_TYPE.SHADER;

    this.vertexShader = shader.vertexShader || "";

    this.fragmentShader = shader.fragmentShader || "";

    this.defines = {};
    // copy defines
    Object.assign( this.defines, shader.defines ); 

    // uniforms should match fragment shader
    this.uniforms = cloneUniforms(shader.uniforms);
}

ShaderMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: ShaderMaterial,

    copy: function(source) {
        Material.prototype.copy.call(this, source);

        this.vertexShader = source.vertexShader;
        this.fragmentShader = source.fragmentShader;

        return this;
    }

});

export {ShaderMaterial};
