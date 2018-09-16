import {MATERIAL_TYPE} from '../const.js';
import {Material} from './Material.js';

/**
 * A standard physically based material, using Metallic-Roughness workflow.
 * Physically based rendering (PBR) has recently become the standard in many 3D applications, such as Unity, Unreal and 3D Studio Max.
 * This approach differs from older approaches in that instead of using approximations for the way in which light interacts with a surface, a physically correct model is used. 
 * The idea is that, instead of tweaking materials to look good under specific lighting, a material can	be created that will react 'correctly' under all lighting scenarios.
 * @constructor
 * @extends zen3d.Material
 * @memberof zen3d
 */
function PBRMaterial() {

    Material.call(this);

    this.type = MATERIAL_TYPE.PBR;

    /**
     * How rough the material appears. 0.0 means a smooth mirror reflection, 1.0 means fully diffuse.
     * If roughnessMap is also provided, both values are multiplied.
     * @type {number}
     * @default 0.5 
     */
    this.roughness = 0.5;

    /**
     * How much the material is like a metal. 
     * Non-metallic materials such as wood or stone use 0.0, metallic use 1.0, with nothing (usually) in between. 
     * A value between 0.0 and 1.0 could be used for a rusty metal look. If metalnessMap is also provided, both values are multiplied.
     * @type {number}
     * @default 0.5 
     */
    this.metalness = 0.5;

    /**
     * The green channel of this texture is used to alter the roughness of the material.
     * @type {zen3d.Texture2D}
     * @default null
     */
    this.roughnessMap = null;

    /**
     * The blue channel of this texture is used to alter the metalness of the material. 
     * @type {zen3d.Texture2D}
     * @default null
     */
    this.metalnessMap = null;

    /**
     * PBR material is affected by lights.
     * @type {boolean}
     * @default true
     */
    this.acceptLight = true;
    
}

PBRMaterial.prototype = Object.assign(Object.create(Material.prototype), /** @lends zen3d.PBRMaterial.prototype */{

    constructor: PBRMaterial,

    copy: function(source) {
        Material.prototype.copy.call(this, source);

        this.roughness = source.roughness;
        this.metalness = source.metalness;

        return this;
    }

});

export {PBRMaterial};
