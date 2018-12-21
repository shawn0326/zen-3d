import { EventDispatcher } from '../EventDispatcher.js';
import { generateUUID } from '../base.js';
import { Box3 } from '../math/Box3.js';
import { Sphere } from '../math/Sphere.js';
import { BufferAttribute } from './BufferAttribute.js';

var geometryId = 1;

/**
 * An efficient representation of mesh, line, or point geometry.
 * Includes vertex positions, face indices, normals, colors, UVs, and custom attributes within buffers, reducing the cost of passing all this data to the GPU.
 * To read and edit data in {@link zen3d.Geometry#attributes}.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.EventDispatcher
 */
function Geometry() {
	EventDispatcher.call(this);

	Object.defineProperty(this, 'id', { value: geometryId++ });

	/**
     * UUID of this geometry instance.
     * This gets automatically assigned, so this shouldn't be edited.
     * @type {string}
     */
	this.uuid = generateUUID();

	/**
     * This hashmap has as id the name of the attribute to be set and as value the buffer to set it to.
     * Rather than accessing this property directly, use {@link zen3d.Geometry#addAttribute} and {@link zen3d.Geometry#getAttribute} to access attributes of this geometry.
     * @type {Object}
     */
	this.attributes = {};

	/**
     * Allows for vertices to be re-used across multiple triangles; this is called using "indexed triangles" and each triangle is associated with the indices of three vertices.
     * This attribute therefore stores the index of each vertex for each triangular face.
     * If this attribute is not set, the renderer assumes that each three contiguous positions represent a single triangle.
     * @type {zen3d.BufferAttribute|null}
     */
	this.index = null;

	/**
     * Bounding box for the bufferGeometry, which can be calculated with {@link zen3d.Geometry#computeBoundingBox}.
     * @type {zen3d.Box3}
     * @default zen3d.Box3()
     */
	this.boundingBox = new Box3();

	/**
     * Bounding sphere for the bufferGeometry, which can be calculated with {@link zen3d.Geometry#computeBoundingSphere}.
     * @type {zen3d.Sphere}
     * @default zen3d.Sphere()
     */
	this.boundingSphere = new Sphere();

	/**
     * Split the geometry into groups, each of which will be rendered in a separate WebGL draw call. This allows an array of materials to be used with the geometry.
     * Each group is an object of the form:
     * { start: Integer, count: Integer, materialIndex: Integer }
     * @type {Array}
     * @default []
     */
	this.groups = [];
}

Geometry.prototype = Object.assign(Object.create(EventDispatcher.prototype), /** @lends zen3d.Geometry.prototype */{

	constructor: Geometry,

	/**
     * Adds an attribute to this geometry.
     * Use this rather than the attributes property.
     * @param {string} name
     * @param {zen3d.BufferAttribute|zen3d.InterleavedBufferAttribute} attribute
     */
	addAttribute: function(name, attribute) {
		this.attributes[name] = attribute;
	},

	/**
     * Returns the attribute with the specified name.
     * @return {zen3d.BufferAttribute|zen3d.InterleavedBufferAttribute}
     */
	getAttribute: function(name) {
		return this.attributes[name];
	},

	/**
     * Removes the attribute with the specified name.
     */
	removeAttribute: function(name) {
		delete this.attributes[name];
	},

	/**
     * Set the {@link zen3d.Geometry#index} buffer.
     * @param {Array|zen3d.BufferAttribute} index
     */
	setIndex: function(index) {
		if (Array.isArray(index)) {
			this.index = new BufferAttribute(new Uint16Array(index), 1);
		} else {
			this.index = index;
		}
	},

	/**
     * Adds a group to this geometry; see the {@link zen3d.Geometry#groups} for details.
     * @param {Integer} start
     * @param {Integer} count
     * @param {Integer} materialIndex
     */
	addGroup: function(start, count, materialIndex) {
		this.groups.push({
			start: start,
			count: count,
			materialIndex: materialIndex !== undefined ? materialIndex : 0
		});
	},

	/**
     * Clears all groups.
     */
	clearGroups: function() {
		this.groups = [];
	},

	/**
     * Computes bounding box of the geometry, updating {@link zen3d.Geometry#boundingBox}.
     * Bounding boxes aren't computed by default. They need to be explicitly computed.
     */
	computeBoundingBox: function() {
		var position = this.attributes["a_Position"] || this.attributes["position"];
		if (position.isInterleavedBufferAttribute) {
			var data = position.data;
			this.boundingBox.setFromArray(data.array, data.stride);
		} else {
			this.boundingBox.setFromArray(position.array, position.size);
		}
	},

	/**
     * Computes bounding sphere of the geometry, updating {@link zen3d.Geometry#boundingSphere}.
     * Bounding spheres aren't computed by default. They need to be explicitly computed.
     */
	computeBoundingSphere: function() {
		var position = this.attributes["a_Position"] || this.attributes["position"];
		if (position.isInterleavedBufferAttribute) {
			var data = position.data;
			this.boundingSphere.setFromArray(data.array, data.stride);
		} else {
			this.boundingSphere.setFromArray(position.array, position.size);
		}
	},

	/**
     * Disposes the object from memory.
     * You need to call this when you want the BufferGeometry removed while the application is running.
     */
	dispose: function() {
		this.dispatchEvent({ type: 'dispose' });
	}

});

export { Geometry };