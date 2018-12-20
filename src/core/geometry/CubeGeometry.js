import { Geometry } from './Geometry.js';
import { BufferAttribute } from './BufferAttribute.js';
import { Vector3 } from '../math/Vector3.js';

/**
 * CubeGeometry is the quadrilateral primitive geometry class.
 * It is typically used for creating a cube or irregular quadrilateral of the dimensions provided with the 'width', 'height', and 'depth' constructor arguments.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.Geometry
 * @param {number} [width=1] - Width of the sides on the X axis.
 * @param {number} [height=1] - Height of the sides on the Y axis.
 * @param {number} [depth=1] - Depth of the sides on the Z axis.
 * @param {Integer} [widthSegments=1] - Number of segmented faces along the width of the sides.
 * @param {Integer} [heightSegments=1] - Number of segmented faces along the height of the sides.
 * @param {Integer} [depthSegments=1] - Number of segmented faces along the depth of the sides.
 */
function CubeGeometry(width, height, depth, widthSegments, heightSegments, depthSegments) {

	Geometry.call(this);

	this.buildGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);

}

CubeGeometry.prototype = Object.assign(Object.create(Geometry.prototype), {

	constructor: CubeGeometry,

	buildGeometry: function(width, height, depth, widthSegments, heightSegments, depthSegments) {

		var scope = this;

		width = width || 1;
		height = height || 1;
		depth = depth || 1;

		// segments

		widthSegments = Math.floor(widthSegments) || 1;
		heightSegments = Math.floor(heightSegments) || 1;
		depthSegments = Math.floor(depthSegments) || 1;

		// buffers

		var indices = [];
		var vertices = [];
		var normals = [];
		var uvs = [];

		// helper variables

		var numberOfVertices = 0;
		var groupStart = 0;

		// build each side of the box geometry

		buildPlane('z', 'y', 'x', -1, -1, depth, height, width, depthSegments, heightSegments, 0); // px
		buildPlane('z', 'y', 'x', 1, -1, depth, height, -width, depthSegments, heightSegments, 1); // nx
		buildPlane('x', 'z', 'y', 1, 1, width, depth, height, widthSegments, depthSegments, 2); // py
		buildPlane('x', 'z', 'y', 1, -1, width, depth, -height, widthSegments, depthSegments, 3); // ny
		buildPlane('x', 'y', 'z', 1, -1, width, height, depth, widthSegments, heightSegments, 4); // pz
		buildPlane('x', 'y', 'z', -1, -1, width, height, -depth, widthSegments, heightSegments, 5); // nz

		// build geometry

		this.setIndex(indices);
		this.addAttribute('a_Position', new BufferAttribute(new Float32Array(vertices), 3));
		this.addAttribute('a_Normal', new BufferAttribute(new Float32Array(normals), 3));
		this.addAttribute('a_Uv', new BufferAttribute(new Float32Array(uvs), 2));

		function buildPlane(u, v, w, udir, vdir, width, height, depth, gridX, gridY, materialIndex) {

			var segmentWidth = width / gridX;
			var segmentHeight = height / gridY;

			var widthHalf = width / 2;
			var heightHalf = height / 2;
			var depthHalf = depth / 2;

			var gridX1 = gridX + 1;
			var gridY1 = gridY + 1;

			var vertexCounter = 0;
			var groupCount = 0;

			var ix, iy;

			var vector = new Vector3();

			// generate vertices, normals and uvs

			for (iy = 0; iy < gridY1; iy++) {

				var y = iy * segmentHeight - heightHalf;

				for (ix = 0; ix < gridX1; ix++) {

					var x = ix * segmentWidth - widthHalf;

					// set values to correct vector component

					vector[u] = x * udir;
					vector[v] = y * vdir;
					vector[w] = depthHalf;

					// now apply vector to vertex buffer

					vertices.push(vector.x, vector.y, vector.z);

					// set values to correct vector component

					vector[u] = 0;
					vector[v] = 0;
					vector[w] = depth > 0 ? 1 : -1;

					// now apply vector to normal buffer

					normals.push(vector.x, vector.y, vector.z);

					// uvs

					uvs.push(ix / gridX);
					uvs.push(1 - (iy / gridY));

					// counters

					vertexCounter += 1;

				}

			}

			// indices

			// 1. you need three indices to draw a single face
			// 2. a single segment consists of two faces
			// 3. so we need to generate six (2*3) indices per segment

			for (iy = 0; iy < gridY; iy++) {

				for (ix = 0; ix < gridX; ix++) {

					var a = numberOfVertices + ix + gridX1 * iy;
					var b = numberOfVertices + ix + gridX1 * (iy + 1);
					var c = numberOfVertices + (ix + 1) + gridX1 * (iy + 1);
					var d = numberOfVertices + (ix + 1) + gridX1 * iy;

					// faces

					indices.push(a, b, d);
					indices.push(b, c, d);

					// increase counter

					groupCount += 6;

				}

			}

			// add a group to the geometry. this will ensure multi material support

			scope.addGroup(groupStart, groupCount, materialIndex);

			// calculate new start value for groups

			groupStart += groupCount;

			// update total number of vertices

			numberOfVertices += vertexCounter;

		}

		this.computeBoundingBox();
		this.computeBoundingSphere();
	}

});

export { CubeGeometry };
