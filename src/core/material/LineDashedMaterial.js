import {MATERIAL_TYPE, DRAW_MODE} from '../const.js';
import {Material} from './Material.js';

/**
 * A material for drawing dashed lines.
 * @constructor
 * @extends zen3d.Material
 * @memberof zen3d
 */
function LineDashedMaterial() {
    Material.call(this);

    this.type = MATERIAL_TYPE.LINE_DASHED;

    /**
     * Controls line thickness.
     * Due to limitations of the OpenGL Core Profile with the WebGL renderer on most platforms linewidth will always be 1 regardless of the set value.
     * @type {number}
     * @default 1
     */
    this.lineWidth = 1;

    /**
     * The scale of the dashed part of a line.
     * @type {number}
     * @default 1 
     */
    this.scale = 1;

    /**
     * The size of the dash. 
     * This is both the gap with the stroke.
     * @type {number}
     * @default 3
     */
    this.dashSize = 3;

    /**
     * The size of the gap.
     * @type {number}
     * @default 1 
     */
    this.gapSize = 1;

    /**
     * Set draw mode to LINE_STRIP.
     * @type {zen3d.DRAW_MODE}
     * @default zen3d.DRAW_MODE.LINE_STRIP
     */
    this.drawMode = DRAW_MODE.LINE_STRIP;
}

LineDashedMaterial.prototype = Object.assign(Object.create(Material.prototype), /** @lends zen3d.LineDashedMaterial.prototype */{

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