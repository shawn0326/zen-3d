(function() {
    /**
     * Mesh
     * @class
     */
    var Mesh = function(geometry, material) {
        Mesh.superClass.constructor.call(this);

        this.geometry = geometry;

        this.material = material;

        this.type = zen3d.OBJECT_TYPE.MESH;
    }

    zen3d.inherit(Mesh, zen3d.Object3D);

    // override
    Mesh.prototype.raycast = function() {
        var sphere = new zen3d.Sphere();
        var box = new zen3d.Box3();
        var inverseMatrix = new zen3d.Matrix4();
        var ray = new zen3d.Ray();

        var barycoord = new zen3d.Vector3();

        var vA = new zen3d.Vector3();
        var vB = new zen3d.Vector3();
        var vC = new zen3d.Vector3();

        var uvA = new zen3d.Vector2();
        var uvB = new zen3d.Vector2();
        var uvC = new zen3d.Vector2();

        var intersectionPoint = new zen3d.Vector3();
        var intersectionPointWorld = new zen3d.Vector3();

        function uvIntersection(point, p1, p2, p3, uv1, uv2, uv3) {
            zen3d.Triangle.barycoordFromPoint(point, p1, p2, p3, barycoord);

            uv1.multiplyScalar(barycoord.x);
            uv2.multiplyScalar(barycoord.y);
            uv3.multiplyScalar(barycoord.z);

            uv1.add(uv2).add(uv3);

            return uv1.clone();
        }

        function checkIntersection(object, raycaster, ray, pA, pB, pC, point) {
            var intersect;
            var material = object.material;

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

            var index = geometry.indicesArray;
            var vertex = geometry.verticesArray;
            var a, b, c;

            for (var i = 0; i < index.length; i += 3) {
                a = index[i];
                b = index[i + 1];
                c = index[i + 2];

                vA.fromArray(vertex, a * geometry.vertexSize);
                vB.fromArray(vertex, b * geometry.vertexSize);
                vC.fromArray(vertex, c * geometry.vertexSize);

                var intersection = checkIntersection(this, raycaster, ray, vA, vB, vC, intersectionPoint);

                if (intersection) {
                    // uv
                    uvA.fromArray(vertex, a * geometry.vertexSize + 13);
                    uvB.fromArray(vertex, b * geometry.vertexSize + 13);
                    uvC.fromArray(vertex, c * geometry.vertexSize + 13);

                    intersection.uv = uvIntersection(intersectionPoint, vA, vB, vC, uvA, uvB, uvC);

                    intersection.face = [a, b, c];
                    intersection.faceIndex = a;

                    intersects.push(intersection);
                }
            }
        }
    }()

    Mesh.prototype.clone = function() {
        return new this.constructor( this.geometry, this.material ).copy( this );
    }

    zen3d.Mesh = Mesh;
})();