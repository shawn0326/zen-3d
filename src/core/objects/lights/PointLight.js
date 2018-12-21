import { LIGHT_TYPE } from '../../const.js';
import { Light } from './Light.js';
import { PointLightShadow } from './PointLightShadow.js';

/**
 * A light that gets emitted from a single point in all directions.
 * A common use case for this is to replicate the light emitted from a bare lightbulb.
 * This light can cast shadows - see {@link zen3d.PointLightShadow} page for details.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.Light
 * @param {number} [color=0xffffff]
 * @param {number} [intensity=1]
 * @param {number} [distance=200]
 * @param {number} [decay=1]
 */
function PointLight(color, intensity, distance, decay) {
	Light.call(this, color, intensity);

	this.lightType = LIGHT_TYPE.POINT;

	/**
     * The amount the light dims along the distance of the light.
     * @type {number}
     * @default 1
     */
	this.decay = (decay !== undefined) ? decay : 1;

	/**
     * The distance from the light where the intensity is 0.
     * @type {number}
     * @default 200
     */
	this.distance = (distance !== undefined) ? distance : 200;

	/**
     * A {@link zen3d.PointLightShadow} used to calculate shadows for this light.
     * @type {zen3d.PointLightShadow}
     * @default zen3d.PointLightShadow()
     */
	this.shadow = new PointLightShadow();
}

PointLight.prototype = Object.assign(Object.create(Light.prototype), /** @lends zen3d.PointLight.prototype */{

	constructor: PointLight,

	copy: function(source) {
		Light.prototype.copy.call(this, source);

		this.shadow.copy(source.shadow);

		return this;
	}
});

export { PointLight };
