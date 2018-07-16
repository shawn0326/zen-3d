import {MATERIAL_TYPE, DRAW_MODE} from '../const.js';
import {Material} from './Material.js';

/**
 * LineMaterial
 * @class
 */
function LineMaterial() {
    Material.call(this);

    this.type = MATERIAL_TYPE.LINE;

    // chrome bug on MacOS: gl.lineWidth no effect
    this.lineWidth = 1;

    this.drawMode = DRAW_MODE.LINES;
}

LineMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: LineMaterial,

    copy: function(source) {
        Material.prototype.copy.call(this, source);

        this.lineWidth = source.lineWidth;

        return this;
    }

});

export {LineMaterial};
