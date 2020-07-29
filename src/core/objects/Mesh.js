import { OBJECT_TYPE, DRAW_SIDE } from '../const.js';
import { Object3D } from './Object3D.js';
import { Sphere } from '../math/Sphere.js';
import { Box3 } from '../math/Box3.js';
import { Matrix4 } from '../math/Matrix4.js';
import { Ray } from '../math/Ray.js';
import { Vector3 } from '../math/Vector3.js';
import { Vector2 } from '../math/Vector2.js';
import { Triangle } from '../math/Triangle.js';

var _sphere = new Sphere();
var _box = new Box3();
var _inverseMatrix = new Matrix4();
var _ray = new Ray();

var _barycoord = new Vector3();

var _vA = new Vector3();
var _vB = new Vector3();
var _vC = new Vector3();

var _uvA = new Vector2();
var _uvB = new Vector2();
var _uvC = new Vector2();

var _intersectionPoint = new Vector3();
var _intersectionPointWorld = new Vector3();

/**
 * Class representing triangular polygon mesh based objects.
 * Also serves as a base for other classes such as {@link zen3d.SkinnedMesh}.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.Object3D
 * @param {zen3d.Geometry} geometry — an instance of {@link zen3d.Geometry}.
 * @param {zen3d.Material} material - a single or an array of {@link zen3d.Material}.
 */
function Mesh(geometry, material) {
	Object3D.call(this);

	/**
     * an instance of {@link zen3d.Geometry}.
     * @type {zen3d.Geometry}
     */
	this.geometry = geometry;

	/**
     * a single or an array of {@link zen3d.Material}.
     * @type {zen3d.Material|zen3d.Material[]}
     */
	this.material = material;

	/**
	 * An array of weights typically from 0-1 that specify how much of the morph is applied.
	 * @type {Number[]|null}
	 * @default null
	 */
	this.morphTargetInfluences = null;

	this.type = OBJECT_TYPE.MESH;
}

Mesh.prototype = Object.assign(Object.create(Object3D.prototype), /** @lends zen3d.Mesh.prototype */{

	constructor: Mesh,

	/**
     * @override
     */
	raycast: function(raycaster, intersects) {
		var geometry = this.geometry;
		var worldMatrix = this.worldMatrix;

		// Sphere test
		_sphere.copy(geometry.boundingSphere);
		_sphere.applyMatrix4(worldMatrix);
		if (!raycaster.ray.intersectsSphere(_sphere)) {
			return;
		}

		// Box test
		_box.copy(geometry.boundingBox);
		_box.applyMatrix4(worldMatrix);
		if (!raycaster.ray.intersectsBox(_box)) {
			return;
		}

		// Vertex test
		_inverseMatrix.getInverse(worldMatrix);
		_ray.copy(raycaster.ray).applyMatrix4(_inverseMatrix);

		var index = geometry.index.array;
		var position = geometry.getAttribute("a_Position");
		var uv = geometry.getAttribute("a_Uv");
		var a, b, c;

		for (var i = 0; i < index.length; i += 3) {
			a = index[i];
			b = index[i + 1];
			c = index[i + 2];

			_vA.fromArray(position.array, a * 3);
			_vB.fromArray(position.array, b * 3);
			_vC.fromArray(position.array, c * 3);

			var intersection = checkIntersection(this, raycaster, _ray, _vA, _vB, _vC, _intersectionPoint);

			if (intersection) {
				// uv
				_uvA.fromArray(uv.array, a * 2);
				_uvB.fromArray(uv.array, b * 2);
				_uvC.fromArray(uv.array, c * 2);

				intersection.uv = uvIntersection(_intersectionPoint, _vA, _vB, _vC, _uvA, _uvB, _uvC);

				intersection.face = [a, b, c];
				intersection.faceIndex = a;

				intersects.push(intersection);
			}
		}
	},

	copy: function(source) {
		Object3D.prototype.copy.call(this, source);
		if (source.morphTargetInfluences) {
			this.morphTargetInfluences = source.morphTargetInfluences.slice();
		}
		return this;
	},

	clone: function() {
		return new this.constructor(this.geometry, this.material).copy(this);
	}

});

function uvIntersection(point, p1, p2, p3, uv1, uv2, uv3) {
	Triangle.barycoordFromPoint(point, p1, p2, p3, _barycoord);

	uv1.multiplyScalar(_barycoord.x);
	uv2.multiplyScalar(_barycoord.y);
	uv3.multiplyScalar(_barycoord.z);

	uv1.add(uv2).add(uv3);

	return uv1.clone();
}

function checkIntersection(object, raycaster, ray, pA, pB, pC, point) {
	var intersect;
	var material = object.material;

	if (material.side === DRAW_SIDE.BACK) {
		intersect = ray.intersectTriangle(pC, pB, pA, true, point);
	} else {
		intersect = ray.intersectTriangle(pA, pB, pC, material.side !== DRAW_SIDE.DOUBLE, point);
	}

	if (intersect === null) return null;

	_intersectionPointWorld.copy(point);
	_intersectionPointWorld.applyMatrix4(object.worldMatrix);

	var distance = raycaster.ray.origin.distanceTo(_intersectionPointWorld);

	if (distance < raycaster.near || distance > raycaster.far) return null;

	return {
		distance: distance,
		point: _intersectionPointWorld.clone(),
		object: object
	};
}

export { Mesh };