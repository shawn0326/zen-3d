/**
 * @author mrdoob / http://mrdoob.com/
 */

zen3d.GeometryUtils = {

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
			geometry.addAttribute('a_Tangent', new zen3d.BufferAttribute(new Float32Array(4 * nVertices), 4));
		}

		var tangents = attributes.a_Tangent.array;

		var tan1 = [], tan2 = [];

		for (var i = 0; i < nVertices; i++) {
			tan1[i] = new zen3d.Vector3();
			tan2[i] = new zen3d.Vector3();
		}

		var vA = new zen3d.Vector3(),
			vB = new zen3d.Vector3(),
			vC = new zen3d.Vector3(),

			uvA = new zen3d.Vector2(),
			uvB = new zen3d.Vector2(),
			uvC = new zen3d.Vector2(),

			sdir = new zen3d.Vector3(),
			tdir = new zen3d.Vector3();

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

		var tmp = new zen3d.Vector3(), tmp2 = new zen3d.Vector3();
		var n = new zen3d.Vector3(), n2 = new zen3d.Vector3();
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
	}

}