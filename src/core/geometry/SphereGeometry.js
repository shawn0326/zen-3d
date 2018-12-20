import { Geometry } from './Geometry.js';
import { BufferAttribute } from './BufferAttribute.js';
import { Vector3 } from '../math/Vector3.js';

/**
 * A class for generating sphere geometries.
 * The geometry is created by sweeping and calculating vertexes around the Y axis (horizontal sweep) and the Z axis (vertical sweep).
 * Thus, incomplete spheres (akin to 'sphere slices') can be created through the use of different values of phiStart, phiLength, thetaStart and thetaLength, in order to define the points in which we start (or end) calculating those vertices.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.Geometry
 * @param {number} [radius=1] — sphere radius. Default is 1.
 * @param {Integer} [widthSegments=8] — number of horizontal segments. Minimum value is 3, and the default is 8.
 * @param {Integer} [heightSegments=6] — number of vertical segments. Minimum value is 2, and the default is 6.
 * @param {number} [phiStart=0] — specify horizontal starting angle. Default is 0.
 * @param {number} [phiLength=Math.PI*2] — specify horizontal sweep angle size. Default is Math.PI * 2.
 * @param {number} [thetaStart=0] — specify vertical starting angle. Default is 0.
 * @param {number} [thetaLength=Math.PI] — specify vertical sweep angle size. Default is Math.PI.
 */
function SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {

    Geometry.call(this);

    this.buildGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);

}

SphereGeometry.prototype = Object.assign(Object.create(Geometry.prototype), {

    constructor: SphereGeometry,

    buildGeometry: function(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
        radius = radius || 1;

        widthSegments = Math.max(3, Math.floor(widthSegments) || 8);
        heightSegments = Math.max(2, Math.floor(heightSegments) || 6);

        phiStart = phiStart !== undefined ? phiStart : 0;
        phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;

        thetaStart = thetaStart !== undefined ? thetaStart : 0;
        thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;

        var thetaEnd = thetaStart + thetaLength;

        var ix, iy;

        var index = 0;
        var grid = [];

        var vertex = new Vector3();
        var normal = new Vector3();

        // buffers

        var indices = [];
        var vertices = [];
        var normals = [];
        var uvs = [];

        // generate vertices, normals and uvs

        for (iy = 0; iy <= heightSegments; iy++) {

            var verticesRow = [];

            var v = iy / heightSegments;

            for (ix = 0; ix <= widthSegments; ix++) {

                var u = ix / widthSegments;

                // vertex

                vertex.x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
                vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);

                vertices.push(vertex.x, vertex.y, vertex.z);

                // normal

                normal.set(vertex.x, vertex.y, vertex.z).normalize();
                normals.push(normal.x, normal.y, normal.z);

                // uv

                uvs.push(u, 1 - v);

                verticesRow.push(index++);

            }

            grid.push(verticesRow);

        }

        // indices

        for (iy = 0; iy < heightSegments; iy++) {

            for (ix = 0; ix < widthSegments; ix++) {

                var a = grid[iy][ix + 1];
                var b = grid[iy][ix];
                var c = grid[iy + 1][ix];
                var d = grid[iy + 1][ix + 1];

                if (iy !== 0 || thetaStart > 0) indices.push(a, b, d);
                if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indices.push(b, c, d);

            }

        }

        this.setIndex(indices);
        this.addAttribute('a_Position', new BufferAttribute(new Float32Array(vertices), 3));
        this.addAttribute('a_Normal', new BufferAttribute(new Float32Array(normals), 3));
        this.addAttribute('a_Uv', new BufferAttribute(new Float32Array(uvs), 2));

        this.computeBoundingBox();
        this.computeBoundingSphere();
    }
});

export { SphereGeometry };