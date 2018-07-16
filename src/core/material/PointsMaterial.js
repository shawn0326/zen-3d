import {MATERIAL_TYPE, DRAW_MODE} from '../const.js';
import {Material} from './Material.js';

/**
 * PointsMaterial
 * @class
 */
function PointsMaterial() {
    Material.call(this);

    this.type = MATERIAL_TYPE.POINT;

    this.size = 1;

    this.sizeAttenuation = true;

    this.drawMode = DRAW_MODE.POINTS;
}

PointsMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: PointsMaterial,

    copy: function(source) {
        Material.prototype.copy.call(this, source);

        this.size = source.size;
        this.sizeAttenuation = source.sizeAttenuation;

        return this;
    }

});

export {PointsMaterial};
