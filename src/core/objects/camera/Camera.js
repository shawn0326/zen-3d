import { OBJECT_TYPE, TEXEL_ENCODING_TYPE } from '../../const.js';
import { Object3D } from '../Object3D.js';
import { Matrix4 } from '../../math/Matrix4.js';
import { Frustum } from '../../math/Frustum.js';
import { Vector4 } from '../../math/Vector4.js';
import { Vector3 } from '../../math/Vector3.js';

var _mat4_1 = new Matrix4();

/**
 * The camera used for rendering a 3D scene.
 * @memberof zen3d
 * @constructor
 * @extends zen3d.Object3D
 */
function Camera() {
	Object3D.call(this);

	this.type = OBJECT_TYPE.CAMERA;

	/**
     * This is the inverse of worldMatrix.
     * @type {zen3d.Matrix4}
     */
	this.viewMatrix = new Matrix4();

	/**
     * This is the matrix which contains the projection.
     * @type {zen3d.Matrix4}
     */
	this.projectionMatrix = new Matrix4();

	/**
     * This is the matrix which contains the projection.
     * @type {zen3d.Matrix4}
     */
	this.projectionMatrixInverse = new Matrix4();

	/**
     * The frustum of the camera.
     * @type {zen3d.Frustum}
     */
	this.frustum = new Frustum();

	// gamma space or linear space
	/**
     * The factor of gamma.
     * @type {number}
     * @default 2.0
     */
	this.gammaFactor = 2.0;

	/**
     * Output pixel encoding.
     * @type {zen3d.TEXEL_ENCODING_TYPE}
     * @default zen3d.TEXEL_ENCODING_TYPE.LINEAR
     */
	this.outputEncoding = TEXEL_ENCODING_TYPE.LINEAR;

	/**
     * Where on the screen is the camera rendered in normalized coordinates.
     * @type {zen3d.Vector4}
     * @default zen3d.Vector4(0, 0, 1, 1)
     */
	this.rect = new Vector4(0, 0, 1, 1);

	/**
     * When this is set, it checks every frame if objects are in the frustum of the camera before rendering objects.
     * Otherwise objects gets rendered every frame even if it isn't visible.
     * @type {boolean}
     * @default true
     */
	this.frustumCulled = true;
}

Camera.prototype = Object.assign(Object.create(Object3D.prototype), /** @lends zen3d.Camera.prototype */{

	constructor: Camera,

	/**
     * Set view by look at, this func will set quaternion of this camera.
     * @method
     * @param {zen3d.Vector3} target - The target that the camera look at.
     * @param {zen3d.Vector3} up - The up direction of the camera.
     */
	lookAt: function(target, up) {
		_mat4_1.lookAtRH(this.position, target, up);
		this.quaternion.setFromRotationMatrix(_mat4_1);
	},

	/**
     * Set orthographic projection matrix.
     * @param {number} left — Camera frustum left plane.
     * @param {number} right — Camera frustum right plane.
     * @param {number} bottom — Camera frustum bottom plane.
     * @param {number} top — Camera frustum top plane.
     * @param {number} near — Camera frustum near plane.
     * @param {number} far — Camera frustum far plane.
     */
	setOrtho: function(left, right, bottom, top, near, far) {
		this.projectionMatrix.set(
			2 / (right - left), 0, 0, -(right + left) / (right - left),
			0, 2 / (top - bottom), 0, -(top + bottom) / (top - bottom),
			0, 0, -2 / (far - near), -(far + near) / (far - near),
			0, 0, 0, 1
		);
		this.projectionMatrixInverse.getInverse(this.projectionMatrix);
	},

	/**
     * Set perspective projection matrix.
     * @param {number} fov — Camera frustum vertical field of view.
     * @param {number} aspect — Camera frustum aspect ratio.
     * @param {number} near — Camera frustum near plane.
     * @param {number} far — Camera frustum far plane.
     */
	setPerspective: function(fov, aspect, near, far) {
		this.projectionMatrix.set(
			1 / (aspect * Math.tan(fov / 2)), 0, 0, 0,
			0, 1 / (Math.tan(fov / 2)), 0, 0,
			0, 0, -(far + near) / (far - near), -2 * far * near / (far - near),
			0, 0, -1, 0
		);
		this.projectionMatrixInverse.getInverse(this.projectionMatrix);
	},

	getWorldDirection: function(optionalTarget) {
		optionalTarget = optionalTarget || new Vector3();
		var e = this.worldMatrix.elements;
		return optionalTarget.set(-e[8], -e[9], -e[10]).normalize();
	},

	updateMatrix: function(force) {
		Object3D.prototype.updateMatrix.call(this, force);

		this.viewMatrix.getInverse(this.worldMatrix); // update view matrix

		_mat4_1.multiplyMatrices(this.projectionMatrix, this.viewMatrix); // get PV matrix
		this.frustum.setFromMatrix(_mat4_1); // update frustum
	},

	copy: function (source, recursive) {
		Object3D.prototype.copy.call(this, source, recursive);

		this.viewMatrix.copy(source.viewMatrix);
		this.projectionMatrix.copy(source.projectionMatrix);
		this.projectionMatrixInverse.copy(source.projectionMatrixInverse);

		this.frustum.copy(source.frustum);
		this.gammaFactor = source.gammaFactor;
		this.outputEncoding = source.outputEncoding;
		this.rect.copy(source.rect);
		this.frustumCulled = source.frustumCulled;

		return this;
	}

});

export { Camera };