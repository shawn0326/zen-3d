(function() {
    /**
     * SphereGeometry data
     * @class
     */
    var SphereGeometry = function(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
        SphereGeometry.superClass.constructor.call(this);

        this.buildGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);
    }

    zen3d.inherit(SphereGeometry, zen3d.Geometry);

    SphereGeometry.prototype.buildGeometry = function(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
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

        var vertex = new zen3d.Vector3();
        var normal = new zen3d.Vector3();

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
        this.addAttribute('a_Position', new zen3d.BufferAttribute(new Float32Array(vertices), 3));
        this.addAttribute('a_Normal', new zen3d.BufferAttribute(new Float32Array(normals), 3));
        this.addAttribute('a_Uv', new zen3d.BufferAttribute(new Float32Array(uvs), 2));

        this.computeBoundingBox();
        this.computeBoundingSphere();
    }

    zen3d.SphereGeometry = SphereGeometry;
})();