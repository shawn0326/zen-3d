(function() {
    /**
     * CylinderGeometry data
     * same as CylinderGeometry of three.js
     * @class
     */
    var CylinderGeometry = function(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
        CylinderGeometry.superClass.constructor.call(this);

        radiusTop = radiusTop !== undefined ? radiusTop : 20;
        radiusBottom = radiusBottom !== undefined ? radiusBottom : 20;
        height = height !== undefined ? height : 100;

        radialSegments = Math.floor(radialSegments) || 8;
        heightSegments = Math.floor(heightSegments) || 1;

        openEnded = openEnded !== undefined ? openEnded : false;
        thetaStart = thetaStart !== undefined ? thetaStart : 0.0;
        thetaLength = thetaLength !== undefined ? thetaLength : 2.0 * Math.PI;

        this.buildGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
    }

    zen3d.inherit(CylinderGeometry, zen3d.Geometry);

    CylinderGeometry.prototype.buildGeometry = function(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
        var vertices = this.verticesArray;
        var indices = this.indicesArray;

        var halfHeight = height / 2;

        var index = 0;
        var indexArray = [];

        generateTorso();

        if (openEnded === false) {
            if (radiusTop > 0) {
                generateCap(true);
            }
            if (radiusBottom > 0) {
                generateCap(false);
            }
        }

        function generateTorso() {
            var x, y;
            var normal = new zen3d.Vector3();
            var vertex = new zen3d.Vector3();

            // this will be used to calculate the normal
            var slope = (radiusBottom - radiusTop) / height;

            // generate vertices
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

                    vertex.x = radius * sinTheta;
                    vertex.y = -v * height + halfHeight;
                    vertex.z = radius * cosTheta;

                    normal.set(sinTheta, slope, cosTheta).normalize();

                    vertices.push(vertex.x, vertex.y, vertex.z, normal.x, normal.y, normal.z, 1.0, 0.0, 0.0, 1, 1, 1, 1, u, 1 - v, 0., 0.);

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
                }
            }
        }

        function generateCap(top) {
            var x, centerIndexStart, centerIndexEnd;

            var uv = new zen3d.Vector2();
            var vertex = new zen3d.Vector3();

            var radius = (top === true) ? radiusTop : radiusBottom;
            var sign = (top === true) ? 1 : -1;

            // save the index of the first center vertex
            centerIndexStart = index;

            // first we generate the center vertex data of the cap.
            // because the geometry needs one set of uvs per face,
            // we must generate a center vertex per face/segment

            for (x = 1; x <= radialSegments; x++) {
                vertices.push(0, halfHeight * sign, 0, 0, sign, 0, 1.0, 0.0, 0.0, 1, 1, 1, 1, 0.5, 0.5, 0., 0.);

                index++;
            }

            // save the index of the last center vertex
            centerIndexEnd = index;

            // now we generate the surrounding vertices
            for (x = 0; x <= radialSegments; x++) {
                var u = x / radialSegments;
                var theta = u * thetaLength + thetaStart;

                var cosTheta = Math.cos(theta);
                var sinTheta = Math.sin(theta);

                vertex.x = radius * sinTheta;
                vertex.y = halfHeight * sign;
                vertex.z = radius * cosTheta;

                uv.x = (cosTheta * 0.5) + 0.5;
                uv.y = (sinTheta * 0.5 * sign) + 0.5;

                vertices.push(vertex.x, vertex.y, vertex.z, 0, sign, 0, 1.0, 0.0, 0.0, 1, 1, 1, 1, uv.x, uv.y, 0., 0.);

                index++;
            }

            // generate indices
            for (x = 0; x < radialSegments; x++) {
                var c = centerIndexStart + x;
                var i = centerIndexEnd + x;

                if (top === true) {
                    indices.push(i, i + 1, c);
                } else {
                    indices.push(i + 1, i, c);
                }
            }
        }

        this.computeBoundingBox();
        this.computeBoundingSphere();
    }

    zen3d.CylinderGeometry = CylinderGeometry;
})();