import { MATERIAL_TYPE, DRAW_MODE } from '../const.js';
import { Material } from './Material.js';

/**
 * A material for drawing wireframe-style geometries.
 * @constructor
 * @extends zen3d.Material
 * @memberof zen3d
 */
function LineMaterial() {
	Material.call(this);

	this.type = MATERIAL_TYPE.LINE;

	/**
     * Controls line thickness.
     * Due to limitations of the OpenGL Core Profile with the WebGL renderer on most platforms linewidth will always be 1 regardless of the set value.
     * @type {number}
     * @default 1
     */
	this.lineWidth = 1;

	/**
     * Set draw mode to LINES / LINE_LOOP / LINE_STRIP
     * @type {zen3d.DRAW_MODE}
     * @default zen3d.DRAW_MODE.LINES
     */
	this.drawMode = DRAW_MODE.LINES;
}

LineMaterial.prototype = Object.assign(Object.create(Material.prototype), /** @lends zen3d.LineMaterial.prototype */{

	constructor: LineMaterial,

	copy: function(source) {
		Material.prototype.copy.call(this, source);

		this.lineWidth = source.lineWidth;

		return this;
	}

});

export { LineMaterial };
