import {MATERIAL_TYPE, DRAW_MODE} from '../const.js';
import {Material} from './Material.js';

/**
 * LineDashedMaterial
 * @class
 */
function LineDashedMaterial() {
    Material.call(this);

    this.type = MATERIAL_TYPE.LINE_DASHED;

    // chrome bug on MacOS: gl.lineWidth no effect
    this.lineWidth = 1;

    this.scale = 1;
    this.dashSize = 3;
    this.gapSize = 1;

    this.drawMode = DRAW_MODE.LINE_STRIP;
}

LineDashedMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: LineDashedMaterial,

    copy: function(source) {
        Material.prototype.copy.call(this, source);

        this.lineWidth = source.lineWidth;
        this.scale = source.scale;
        this.dashSize = source.dashSize;
        this.gapSize = source.gapSize;

        return this;
    }

});

export {LineDashedMaterial};