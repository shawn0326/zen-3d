import {MATERIAL_TYPE, BLEND_TYPE, DRAW_MODE} from '../const.js';
import {Material} from './Material.js';

/**
 * ParticleMaterial
 * @class
 */
function ParticleMaterial() {
    Material.call(this);

    this.type = MATERIAL_TYPE.PARTICLE;

    this.transparent = true;

    this.blending = BLEND_TYPE.ADD;

    this.depthTest = true;
    this.depthWrite = false;

    this.drawMode = DRAW_MODE.POINTS;
}

ParticleMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: ParticleMaterial

});

export {ParticleMaterial};