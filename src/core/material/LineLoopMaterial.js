import {MATERIAL_TYPE, DRAW_MODE} from '../const.js';
import {Material} from './Material.js';

/**
 * LineLoopMaterial
 * @class
 */
function LineLoopMaterial() {
    Material.call(this);

    this.type = MATERIAL_TYPE.LINE_LOOP;

    // chrome bug on MacOS: gl.lineWidth no effect
    this.lineWidth = 1;

    this.drawMode = DRAW_MODE.LINE_LOOP;
}

LineLoopMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: LineLoopMaterial,

    copy: function(source) {
        Material.prototype.copy.call(this, source);

        this.lineWidth = source.lineWidth;

        return this;
    }

});

export {LineLoopMaterial};
