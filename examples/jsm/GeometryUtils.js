/**
 * @author mrdoob / http://mrdoob.com/
 */

import {
	BufferAttribute,
	Geometry,
	Matrix3,
	Vector2,
	Vector3
} from "../../build/zen3d.module.js";

var GeometryUtils = {

	computeTangents: function(geometry) {
		var index = geometry.index;
		var attributes = geometry.attributes;

		// based on http://www.terathon.com/code/tangent.html
		// (per vertex tangents)

		if (index === null ||
                attributes.a_Position === undefined ||
                attributes.a_Normal === undefined ||
                attributes.a_Uv === undefined) {
			console.warn('zen3d.Geometry: Missing required attributes (index, position, normal or uv) in GeometryUtils.computeTangents()');
			return;
		}

		var indices = index.array;
		var positions = attributes.a_Position.array;
		var normals = attributes.a_Normal.array;
		var uvs = attributes.a_Uv.array;

		var nVertices = positions.length / 3;

		if (attributes.tangent === undefined) {
			geometry.addAttribute('a_Tangent', new BufferAttribute(new Float32Array(4 * nVertices), 4));
		}

		var tangents = attributes.a_Tangent.array;

		var tan1 = [], tan2 = [];

		for (var i = 0; i < nVertices; i++) {
			tan1[i] = new Vector3();
			tan2[i] = new Vector3();
		}

		var vA = new Vector3(),
			vB = new Vector3(),
			vC = new Vector3(),

			uvA = new Vector2(),
			uvB = new Vector2(),
			uvC = new Vector2(),

			sdir = new Vector3(),
			tdir = new Vector3();

		function handleTriangle(a, b, c) {
			vA.fromArray(positions, a * 3);
			vB.fromArray(positions, b * 3);
			vC.fromArray(positions, c * 3);

			uvA.fromArray(uvs, a * 2);
			uvB.fromArray(uvs, b * 2);
			uvC.fromArray(uvs, c * 2);

			vB.sub(vA);
			vC.sub(vA);

			uvB.sub(uvA);
			uvC.sub(uvA);

			var r = 1.0 / (uvB.x * uvC.y - uvC.x * uvB.y);

			// silently ignore degenerate uv triangles having coincident or colinear vertices

			if (!isFinite(r)) return;

			sdir.copy(vB).multiplyScalar(uvC.y).addScaledVector(vC, -uvB.y).multiplyScalar(r);
			tdir.copy(vC).multiplyScalar(uvB.x).addScaledVector(vB, -uvC.x).multiplyScalar(r);

			tan1[a].add(sdir);
			tan1[b].add(sdir);
			tan1[c].add(sdir);

			tan2[a].add(tdir);
			tan2[b].add(tdir);
			tan2[c].add(tdir);
		}

		var groups = geometry.groups;

		if (groups.length === 0) {
			groups = [{
				start: 0,
				count: indices.length
			}];
		}

		for (var i = 0, il = groups.length; i < il; ++i) {
			var group = groups[i];

			var start = group.start;
			var count = group.count;

			for (var j = start, jl = start + count; j < jl; j += 3) {
				handleTriangle(
					indices[j + 0],
					indices[j + 1],
					indices[j + 2]
				);
			}
		}

		var tmp = new Vector3(), tmp2 = new Vector3();
		var n = new Vector3(), n2 = new Vector3();
		var w, t, test;

		function handleVertex(v) {
			n.fromArray(normals, v * 3);
			n2.copy(n);

			t = tan1[v];

			// Gram-Schmidt orthogonalize

			tmp.copy(t);
			tmp.sub(n.multiplyScalar(n.dot(t))).normalize();

			// Calculate handedness

			tmp2.crossVectors(n2, t);
			test = tmp2.dot(tan2[v]);
			w = (test < 0.0) ? -1.0 : 1.0;

			tangents[v * 4] = tmp.x;
			tangents[v * 4 + 1] = tmp.y;
			tangents[v * 4 + 2] = tmp.z;
			tangents[v * 4 + 3] = -w; // why negative?
		}

		for (var i = 0, il = groups.length; i < il; ++i) {
			var group = groups[i];

			var start = group.start;
			var count = group.count;

			for (var j = start, jl = start + count; j < jl; j += 3) {
				handleVertex(indices[j + 0]);
				handleVertex(indices[j + 1]);
				handleVertex(indices[j + 2]);
			}
		}
	},

	// TODO morphTargetAttributes
	mergeGeometries: function(geometries, useGroups) {
		var isIndexed = geometries[0].index !== null;

		var attributesUsed = new Set(Object.keys(geometries[0].attributes));

		var attributes = {};

		var mergedGeometry = new Geometry();

		var offset = 0;

		for (var i = 0; i < geometries.length; ++i) {
			var geometry = geometries[i];

			// ensure that all geometries are indexed, or none

			if (isIndexed !== (geometry.index !== null)) return null;

			// gather attributes, exit early if they're different

			for (var name in geometry.attributes) {
				if (!attributesUsed.has(name)) return null;

				if (attributes[name] === undefined) attributes[name] = [];

				attributes[name].push(geometry.attributes[name]);
			}

			if (useGroups) {
				var count;

				if (isIndexed) {
					count = geometry.index.count;
				} else if (geometry.attributes.position !== undefined) {
					count = geometry.attributes.position.count;
				} else {
					return null;
				}

				mergedGeometry.addGroup(offset, count, i);

				offset += count;
			}
		}

		// merge indices

		if (isIndexed) {
			var indexOffset = 0;
			var mergedIndex = [];

			for (var i = 0; i < geometries.length; ++i) {
				var index = geometries[i].index;

				for (var j = 0; j < index.count; ++j) {
					mergedIndex.push(index.array[j] + indexOffset);
				}

				indexOffset += geometries[i].attributes.a_Position.count;
			}

			mergedGeometry.setIndex(mergedIndex);
		}

		// merge attributes

		for (var name in attributes) {
			var mergedAttribute = this.mergeBufferAttributes(attributes[name]);

			if (!mergedAttribute) return null;

			mergedGeometry.addAttribute(name, mergedAttribute);
		}

		return mergedGeometry;
	},

	mergeBufferAttributes: function (attributes) {
		var TypedArray;
		var size;
		var normalized;
		var arrayLength = 0;

		for (var i = 0; i < attributes.length; ++i) {
			var attribute = attributes[i];

			if (attribute.isInterleavedBufferAttribute) return null;

			if (TypedArray === undefined) TypedArray = attribute.array.constructor;
			if (TypedArray !== attribute.array.constructor) return null;

			if (size === undefined) size = attribute.size;
			if (size !== attribute.size) return null;

			if (normalized === undefined) normalized = attribute.normalized;
			if (normalized !== attribute.normalized) return null;

			arrayLength += attribute.array.length;
		}

		var array = new TypedArray(arrayLength);
		var offset = 0;

		for (var i = 0; i < attributes.length; ++i) {
			array.set(attributes[i].array, offset);

			offset += attributes[i].array.length;
		}

		return new BufferAttribute(array, size, normalized);
	},

	applyMatrix4: (function() {
		var _vector3 = new Vector3();
		var _mat3 = new Matrix3();

		return function(geometry, matrix, updateBoundings) {
			var array, count;

			var position = geometry.attributes['a_Position'];
			if (position !== undefined) {
				array = position.array;
				count = position.count;
				for (var i = 0; i < count; i++) {
					_vector3.fromArray(array, i * 3);
					_vector3.applyMatrix4(matrix);
					_vector3.toArray(array, i * 3);
				}
				position.version++;
			}

			var normal = geometry.attributes['a_Normal'];
			if (normal !== undefined) {
				array = normal.array;
				count = normal.count;
				var normalMatrix = _mat3.setFromMatrix4(matrix).inverse().transpose();
				for (var i = 0; i < count; i++) {
					_vector3.fromArray(array, i * 3);
					_vector3.applyMatrix4(normalMatrix).normalize();
					_vector3.toArray(array, i * 3);
				}
				normal.version++;
			}

			var tangent = geometry.attributes['a_Tangent'];
			if (tangent !== undefined) {
				array = tangent.array;
				count = tangent.count;
				for (var i = 0; i < count; i++) {
					_vector3.fromArray(array, i * 3);
					_vector3.transformDirection(matrix);
					_vector3.toArray(array, i * 3);
				}
				tangent.version++;
			}

			if (geometry.boundingBox !== null && updateBoundings) {
				geometry.computeBoundingBox();
			}

			if (geometry.boundingSphere !== null && updateBoundings) {
				geometry.computeBoundingSphere();
			}
		}
	})()

}

export { GeometryUtils };