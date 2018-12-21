import { Vector2 } from './Vector2.js';

/**
 * @constructor
 * @memberof zen3d
 * @param {zen3d.Vector2} min
 * @param {zen3d.Vector2} max
 */
function Box2(min, max) {
	this.min = (min !== undefined) ? min : new Vector2(+Infinity, +Infinity);
	this.max = (max !== undefined) ? max : new Vector2(-Infinity, -Infinity);
}

Object.assign(Box2.prototype, /** @lends zen3d.Box2.prototype */{

	/**
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     */
	set: function(x1, y1, x2, y2) {
		this.min.set(x1, y1);
		this.max.set(x2, y2);
	},

	/**
     * @param {zen3d.Box2} box
     * @return {zen3d.Box2}
     */
	copy: function(box) {
		this.min.copy(box.min);
		this.max.copy(box.max);

		return this;
	}

});

export { Box2 };