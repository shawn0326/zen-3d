import { Geometry } from './Geometry.js';
import { BufferAttribute } from './BufferAttribute.js';

/**
 * A class for generating plane geometries.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.Geometry
 * @param {number} [width=1] — Width along the X axis.
 * @param {number} [height=1] — Height along the Y axis.
 * @param {Integer} [widthSegments=1] — Optional.
 * @param {Integer} [heightSegments=1] — Optional.
 */
function PlaneGeometry(width, height, widthSegments, heightSegments) {
	Geometry.call(this);

	this.buildGeometry(width, height, widthSegments, heightSegments);
}

PlaneGeometry.prototype = Object.assign(Object.create(Geometry.prototype), {

	constructor: PlaneGeometry,

	buildGeometry: function(width, height, widthSegments, heightSegments) {
		width = width || 1;
		height = height || 1;

		var width_half = width / 2;
		var height_half = height / 2;

		var gridX = Math.floor(widthSegments) || 1;
		var gridY = Math.floor(heightSegments) || 1;

		var gridX1 = gridX + 1;
		var gridY1 = gridY + 1;

		var segment_width = width / gridX;
		var segment_height = height / gridY;

		var ix, iy;

		// buffers

		var indices = [];
		var vertices = [];
		var normals = [];
		var uvs = [];

		// generate vertices, normals and uvs

		for (iy = 0; iy < gridY1; iy++) {
			var y = iy * segment_height - height_half;

			for (ix = 0; ix < gridX1; ix++) {
				var x = ix * segment_width - width_half;

				vertices.push(x, 0, y);

				normals.push(0, 1, 0);

				uvs.push(ix / gridX);
				uvs.push(1 - (iy / gridY));
			}
		}

		// indices

		for (iy = 0; iy < gridY; iy++) {
			for (ix = 0; ix < gridX; ix++) {
				var a = ix + gridX1 * iy;
				var b = ix + gridX1 * (iy + 1);
				var c = (ix + 1) + gridX1 * (iy + 1);
				var d = (ix + 1) + gridX1 * iy;

				// faces

				indices.push(a, b, d);
				indices.push(b, c, d);
			}
		}

		// build geometry

		this.setIndex(indices);
		this.addAttribute('a_Position', new BufferAttribute(new Float32Array(vertices), 3));
		this.addAttribute('a_Normal', new BufferAttribute(new Float32Array(normals), 3));
		this.addAttribute('a_Uv', new BufferAttribute(new Float32Array(uvs), 2));

		this.computeBoundingBox();
		this.computeBoundingSphere();
	}

});

export { PlaneGeometry };
