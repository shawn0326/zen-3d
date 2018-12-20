import { Geometry } from './Geometry.js';
import { BufferAttribute } from './BufferAttribute.js';
import { Vector2 } from '../math/Vector2.js';
import { Vector3 } from '../math/Vector3.js';

/**
 * A class for generating cylinder geometries.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.Geometry
 * @param {number} [radiusTop=1] — Radius of the cylinder at the top.
 * @param {number} [radiusBottom=1] — Radius of the cylinder at the bottom.
 * @param {number} [height=1] — Height of the cylinder.
 * @param {Integer} [radialSegments=8] — Number of segmented faces around the circumference of the cylinder.
 * @param {Integer} [heightSegments=1] — Number of rows of faces along the height of the cylinder.
 * @param {number} [openEnded=false] — A Boolean indicating whether the ends of the cylinder are open or capped. Default is false, meaning capped.
 * @param {number} [thetaStart=0] — Start angle for first segment, default = 0 (three o'clock position).
 * @param {number} [thetaLength=2*Pi] — The central angle, often called theta, of the circular sector. The default is 2*Pi, which makes for a complete cylinder.
 */
function CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {

	Geometry.call(this);

	this.buildGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);

}

CylinderGeometry.prototype = Object.assign(Object.create(Geometry.prototype), {

	constructor: CylinderGeometry,

	buildGeometry: function(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
		var scope = this;

		radiusTop = radiusTop !== undefined ? radiusTop : 1;
		radiusBottom = radiusBottom !== undefined ? radiusBottom : 1;
		height = height || 1;

		radialSegments = Math.floor(radialSegments) || 8;
		heightSegments = Math.floor(heightSegments) || 1;

		openEnded = openEnded !== undefined ? openEnded : false;
		thetaStart = thetaStart !== undefined ? thetaStart : 0.0;
		thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;

		// buffers

		var indices = [];
		var vertices = [];
		var normals = [];
		var uvs = [];

		// helper variables

		var index = 0;
		var indexArray = [];
		var halfHeight = height / 2;
		var groupStart = 0;

		// generate geometry

		generateTorso();

		if (openEnded === false) {

			if (radiusTop > 0) generateCap(true);
			if (radiusBottom > 0) generateCap(false);

		}

		// build geometry

		this.setIndex(indices);
		this.addAttribute('a_Position', new BufferAttribute(new Float32Array(vertices), 3));
		this.addAttribute('a_Normal', new BufferAttribute(new Float32Array(normals), 3));
		this.addAttribute('a_Uv', new BufferAttribute(new Float32Array(uvs), 2));

		function generateTorso() {

			var x, y;
			var normal = new Vector3();
			var vertex = new Vector3();

			var groupCount = 0;

			// this will be used to calculate the normal
			var slope = (radiusBottom - radiusTop) / height;

			// generate vertices, normals and uvs

			for (y = 0; y <= heightSegments; y++) {

				var indexRow = [];

				var v = y / heightSegments;

				// calculate the radius of the current row

				var radius = v * (radiusBottom - radiusTop) + radiusTop;

				for (x = 0; x <= radialSegments; x++) {

					var u = x / radialSegments;

					var theta = u * thetaLength + thetaStart;

					var sinTheta = Math.sin(theta);
					var cosTheta = Math.cos(theta);

					// vertex

					vertex.x = radius * sinTheta;
					vertex.y = -v * height + halfHeight;
					vertex.z = radius * cosTheta;
					vertices.push(vertex.x, vertex.y, vertex.z);

					// normal

					normal.set(sinTheta, slope, cosTheta).normalize();
					normals.push(normal.x, normal.y, normal.z);

					// uv

					uvs.push(u, 1 - v);

					// save index of vertex in respective row

					indexRow.push(index++);

				}

				// now save vertices of the row in our index array

				indexArray.push(indexRow);

			}

			// generate indices

			for (x = 0; x < radialSegments; x++) {

				for (y = 0; y < heightSegments; y++) {

					// we use the index array to access the correct indices

					var a = indexArray[y][x];
					var b = indexArray[y + 1][x];
					var c = indexArray[y + 1][x + 1];
					var d = indexArray[y][x + 1];

					// faces

					indices.push(a, b, d);
					indices.push(b, c, d);

					// update group counter

					groupCount += 6;

				}

			}

			// add a group to the geometry. this will ensure multi material support

			scope.addGroup(groupStart, groupCount, 0);

			// calculate new start value for groups

			groupStart += groupCount;

		}

		function generateCap(top) {

			var x, centerIndexStart, centerIndexEnd;

			var uv = new Vector2();
			var vertex = new Vector3();

			var groupCount = 0;

			var radius = (top === true) ? radiusTop : radiusBottom;
			var sign = (top === true) ? 1 : -1;

			// save the index of the first center vertex
			centerIndexStart = index;

			// first we generate the center vertex data of the cap.
			// because the geometry needs one set of uvs per face,
			// we must generate a center vertex per face/segment

			for (x = 1; x <= radialSegments; x++) {

				// vertex

				vertices.push(0, halfHeight * sign, 0);

				// normal

				normals.push(0, sign, 0);

				// uv

				uvs.push(0.5, 0.5);

				// increase index

				index++;

			}

			// save the index of the last center vertex

			centerIndexEnd = index;

			// now we generate the surrounding vertices, normals and uvs

			for (x = 0; x <= radialSegments; x++) {

				var u = x / radialSegments;
				var theta = u * thetaLength + thetaStart;

				var cosTheta = Math.cos(theta);
				var sinTheta = Math.sin(theta);

				// vertex

				vertex.x = radius * sinTheta;
				vertex.y = halfHeight * sign;
				vertex.z = radius * cosTheta;
				vertices.push(vertex.x, vertex.y, vertex.z);

				// normal

				normals.push(0, sign, 0);

				// uv

				uv.x = (cosTheta * 0.5) + 0.5;
				uv.y = (sinTheta * 0.5 * sign) + 0.5;
				uvs.push(uv.x, uv.y);

				// increase index

				index++;

			}

			// generate indices

			for (x = 0; x < radialSegments; x++) {

				var c = centerIndexStart + x;
				var i = centerIndexEnd + x;

				if (top === true) {

					// face top

					indices.push(i, i + 1, c);

				} else {

					// face bottom

					indices.push(i + 1, i, c);

				}

				groupCount += 3;

			}

			// add a group to the geometry. this will ensure multi material support

			scope.addGroup(groupStart, groupCount, top === true ? 1 : 2);

			// calculate new start value for groups

			groupStart += groupCount;

		}

		this.computeBoundingBox();
		this.computeBoundingSphere();
	}

});

export { CylinderGeometry };