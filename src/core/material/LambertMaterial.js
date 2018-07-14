import {MATERIAL_TYPE} from '../const.js';
import {Material} from './Material.js';

/**
 * LambertMaterial
 * @class
 */
function LambertMaterial() {
    Material.call(this);

    this.type = MATERIAL_TYPE.LAMBERT;

    this.acceptLight = true;
}

LambertMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: LambertMaterial

});

export {LambertMaterial};