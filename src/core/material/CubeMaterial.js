import {MATERIAL_TYPE, DRAW_SIDE} from '../const.js';
import {Material} from './Material.js';

/**
 * CubeMaterial
 * @class
 */
function CubeMaterial() {
    Material.call(this);

    this.type = MATERIAL_TYPE.CUBE;

    this.side = DRAW_SIDE.BACK;

    this.cubeMap = null;
}

CubeMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: CubeMaterial,

    copy: function(source) {
        Material.copy.call(this, source);

        this.cubeMap = source.cubeMap;

        return this;
    }

});

export {CubeMaterial};
