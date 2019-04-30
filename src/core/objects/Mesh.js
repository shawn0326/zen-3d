import { OBJECT_TYPE } from '../const.js';
import { Object3D } from './Object3D.js';
import { Sphere } from '../math/Sphere.js';
import { Box3 } from '../math/Box3.js';
import { Matrix4 } from '../math/Matrix4.js';
import { Ray } from '../math/Ray.js';
import { Vector3 } from '../math/Vector3.js';
import { Vector2 } from '../math/Vector2.js';
import { Triangle } from '../math/Triangle.js';

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
	raycast: function() {
		var sphere = new Sphere();
		var box = new Box3();
		var inverseMatrix = new Matrix4();
		var ray = new Ray();

		var barycoord = new Vector3();

		var vA = new Vector3();
		var vB = new Vector3();
		var vC = new Vector3();

		var uvA = new Vector2();
		var uvB = new Vector2();
		var uvC = new Vector2();

		var intersectionPoint = new Vector3();
		var intersectionPointWorld = new Vector3();

		function uvIntersection(point, p1, p2, p3, uv1, uv2, uv3) {
			Triangle.barycoordFromPoint(point, p1, p2, p3, barycoord);

			uv1.multiplyScalar(barycoord.x);
			uv2.multiplyScalar(barycoord.y);
			uv3.multiplyScalar(barycoord.z);

			uv1.add(uv2).add(uv3);

			return uv1.clone();
		}

		function checkIntersection(object, raycaster, ray, pA, pB, pC, point) {
			var intersect;
			// var material = object.material;

			// if (material.side === BackSide) {
			//     intersect = ray.intersectTriangle(pC, pB, pA, true, point);
			// } else {
			// intersect = ray.intersectTriangle(pA, pB, pC, material.side !== DoubleSide, point);
			// }
			intersect = ray.intersectTriangle(pC, pB, pA, true, point);

			if (intersect === null) return null;

			intersectionPointWorld.copy(point);
			intersectionPointWorld.applyMatrix4(object.worldMatrix);

			var distance = raycaster.ray.origin.distanceTo(intersectionPointWorld);

			if (distance < raycaster.near || distance > raycaster.far) return null;

			return {
				distance: distance,
				point: intersectionPointWorld.clone(),
				object: object
			};
		}

		return function raycast(raycaster, intersects) {
			var geometry = this.geometry;
			var worldMatrix = this.worldMatrix;

			// sphere test
			sphere.copy(geometry.boundingSphere);
			sphere.applyMatrix4(worldMatrix);
			if (!raycaster.ray.intersectsSphere(sphere)) {
				return;
			}

			// box test
			box.copy(geometry.boundingBox);
			box.applyMatrix4(worldMatrix);
			if (!raycaster.ray.intersectsBox(box)) {
				return;
			}

			// vertex test
			inverseMatrix.getInverse(worldMatrix);
			ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);

			var index = geometry.index.array;
			var position = geometry.getAttribute("a_Position");
			var uv = geometry.getAttribute("a_Uv");
			var a, b, c;

			for (var i = 0; i < index.length; i += 3) {
				a = index[i];
				b = index[i + 1];
				c = index[i + 2];

				vA.fromArray(position.array, a * 3);
				vB.fromArray(position.array, b * 3);
				vC.fromArray(position.array, c * 3);

				var intersection = checkIntersection(this, raycaster, ray, vA, vB, vC, intersectionPoint);

				if (intersection) {
					// uv
					uvA.fromArray(uv.array, a * 2);
					uvB.fromArray(uv.array, b * 2);
					uvC.fromArray(uv.array, c * 2);

					intersection.uv = uvIntersection(intersectionPoint, vA, vB, vC, uvA, uvB, uvC);

					intersection.face = [a, b, c];
					intersection.faceIndex = a;

					intersects.push(intersection);
				}
			}
		}
	}(),

	clone: function() {
		return new this.constructor(this.geometry, this.material).copy(this);
	}

});

export { Mesh };