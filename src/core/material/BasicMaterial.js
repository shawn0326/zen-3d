import {MATERIAL_TYPE} from '../const.js';
import {Material} from './Material.js';

/**
 * BasicMaterial
 * @class
 */
function BasicMaterial() {
    Material.call(this);

    this.type = MATERIAL_TYPE.BASIC;
}

BasicMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: BasicMaterial

});

export {BasicMaterial};
