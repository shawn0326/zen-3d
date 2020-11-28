import { OBJECT_TYPE } from '../const.js';
import { LightCache } from '../render/LightCache.js';
import { RenderList } from '../render/RenderList.js';
import { Object3D } from './Object3D.js';

/**
 * Scenes allow you to set up what and where is to be rendered by zen3d.
 * This is where you place objects, lights and cameras.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.Object3D
 */
function Scene() {
	Object3D.call(this);

	this.type = OBJECT_TYPE.SCENE;

	/**
     * If not null, it will force everything in the scene to be rendered with that material.
     * @type {zen3d.Material}
     * @default null
     */
	this.overrideMaterial = null;

	/**
     * A {@link zen3d.Fog} instance defining the type of fog that affects everything rendered in the scene.
     * @type {zen3d.Fog}
     * @default null
     */
	this.fog = null;

	/**
     * User-defined clipping planes specified as {@link zen3d.Plane} objects in world space.
     * These planes apply to the scene.
     * Points in space whose dot product with the plane is negative are cut away.
     * @type {zen3d.Plane[]}
     * @default []
     */
	this.clippingPlanes = [];

	/**
     * Defines whether disable shadow sampler feature.
	 * Shader with sampler2DShadow uniforms may cause unknown error on some android phones, set disableShadowSampler to true to avoid these bugs.
     * @type {boolean}
     * @default false
     */
	this.disableShadowSampler = false;

	/**
     * A {@link zen3d.LightCache} instance that collected all lights info after the calling of {@link zen3d.Scene#updateLights}.
     * @type {zen3d.LightCache}
     * @default zen3d.LightCache()
     */
	this.lights = new LightCache();

	this._renderListMap = new WeakMap();
}

Scene.prototype = Object.assign(Object.create(Object3D.prototype), /** @lends zen3d.Scene.prototype */{

	constructor: Scene,

	/**
     * Update {@link zen3d.RenderList} for the scene and camera.
     * @param {zen3d.Camera} camera - The camera.
     * @return {RenderList} - The result render list.
     */
	updateRenderList: function(camera) {
		if (!this._renderListMap.has(camera)) {
			this._renderListMap.set(camera, new RenderList());
		}

		var renderList = this._renderListMap.get(camera);

		renderList.startCount();

		this._doUpdateRenderList(this, camera, renderList);

		renderList.endCount();

		renderList.sort();

		return renderList;
	},

	/**
     * Get {@link zen3d.RenderList} for the scene and camera.
     * The Render List must be updated before this calling.
     * @param {zen3d.Camera} camera - The camera.
     * @return {RenderList} - The target render list.
     */
	getRenderList: function(camera) {
		return this._renderListMap.get(camera);
	},

	/**
     * Update all lights in the scene.
     * @return {LightCache} - An instance of {@link LightCache} whitch contains all lights in the scene.
     */
	updateLights: function() {
		var lights = this.lights;

		lights.startCount();

		this._doUpdateLights(this);

		lights.endCount();

		return lights;
	},

	_doUpdateRenderList: function(object, camera, renderList) {
		if (!object.visible) {
			return;
		}

		if (!!object.geometry && !!object.material) { // renderable
			renderList.add(object, camera);
		}

		// skip ui children
		if (OBJECT_TYPE.CANVAS2D === object.type) {
			return;
		}

		// handle children by recursion
		var children = object.children;
		for (var i = 0, l = children.length; i < l; i++) {
			this._doUpdateRenderList(children[i], camera, renderList);
		}
	},

	_doUpdateLights: function(object) {
		if (!object.visible) {
			return;
		}

		if (OBJECT_TYPE.LIGHT === object.type) { // light
			this.lights.add(object);
		}

		// skip ui children
		if (OBJECT_TYPE.CANVAS2D === object.type) {
			return;
		}

		// handle children by recursion
		var children = object.children;
		for (var i = 0, l = children.length; i < l; i++) {
			this._doUpdateLights(children[i]);
		}
	}

});

export { Scene };
