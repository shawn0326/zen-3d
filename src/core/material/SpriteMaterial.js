import {MATERIAL_TYPE} from '../const.js';
import {Material} from './Material.js';

/**
 * SpriteMaterial
 * @class
 */
function SpriteMaterial() {
    Material.call(this);

    this.type = MATERIAL_TYPE.SPRITE;

    this.rotation = 0;

    this.fog = false;
}

SpriteMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: SpriteMaterial,

    copy: function(source) {
        Material.copy.call(this, source);

        this.rotation = source.rotation;
        this.fog = source.fog;

        return this;
    }

});

export {SpriteMaterial};
