import { Camera } from '../camera/Camera.js';
import { Matrix4 } from '../../math/Matrix4.js';
import { Vector2 } from '../../math/Vector2.js';

/**
 * Serves as a base class for the other shadow classes.
 * @constructor
 * @hideconstructor
 * @abstract
 * @memberof zen3d
 */
function LightShadow() {
	/**
     * The light's view of the world.
     * This is used to generate a depth map of the scene; objects behind other objects from the light's perspective will be in shadow.
     * @type {zen3d.Camera}
     */
	this.camera = new Camera();

	/**
     * Model to shadow camera space, to compute location and depth in shadow map. Stored in a {@link zen3d.Matrix4}.
     * This is computed internally during rendering.
     * @type {zen3d.Matrix4}
     */
	this.matrix = new Matrix4();

	/**
     * Shadow map bias, how much to add or subtract from the normalized depth when deciding whether a surface is in shadow.
     * Very tiny adjustments here (in the order of 0.0001) may help reduce artefacts in shadows.
     * @type {number}
     * @default 0.0003
     */
	this.bias = 0.0003;

	/**
     * Setting this to values greater than 1 will blur the edges of the shadow.
     * High values will cause unwanted banding effects in the shadows - a greater mapSize will allow for a higher value to be used here before these effects become visible.
     * Note that this has no effect if the {@link @zen3d.Object3D#shadowType} is set to PCF or PCSS.
     * @type {number}
     * @default 2
     */
	this.radius = 2;

	/**
     * Shadow camera near.
     * @type {number}
     * @default 1
     */
	this.cameraNear = 1;

	/**
     * Shadow camera far.
     * @type {number}
     * @default 500
     */
	this.cameraFar = 500;

	/**
     * A {@link zen3d.Vector2} defining the width and height of the shadow map.
     * Higher values give better quality shadows at the cost of computation time.
     * Values must be powers of 2,
     * @type {zen3d.Vector2}
     * @default zen3d.Vector2(512, 512)
     */
	this.mapSize = new Vector2(512, 512);

	this.renderTarget = null;
	this.map = null;
}

Object.assign(LightShadow.prototype, /** @lends zen3d.LightShadow.prototype */{

	update: function(light, face) {

	},

	copy: function(source) {
		this.camera.copy(source.camera);
		this.matrix.copy(source.matrix);

		this.bias = source.bias;
		this.radius = source.radius;

		this.cameraNear = source.cameraNear;
		this.cameraFar = source.cameraFar;

		this.mapSize.copy(source.mapSize);

		return this;
	},

	clone: function() {
		return new this.constructor().copy(this);
	}

});

export { LightShadow };