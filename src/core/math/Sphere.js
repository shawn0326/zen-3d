(function() {
    var Sphere = function(center, radius) {
        this.center = (center !== undefined) ? center : new zen3d.Vector3();
        this.radius = (radius !== undefined) ? radius : 0;
    }

    Sphere.prototype.set = function(center, radius) {
        this.center.copy(center);
        this.radius = radius;

        return this;
    }

    Sphere.prototype.setFromArray = function() {
        var box = new zen3d.Box3();
        var point = new zen3d.Vector3();

        return function setFromArray(array, gap) {
            var _gap = (gap !== undefined ? gap : 3);

            var center = this.center;

            box.setFromArray(array, _gap).getCenter(center);

            var maxRadiusSq = 0;

            for (var i = 0, l = array.length; i < l; i += _gap) {
                var x = array[i];
                var y = array[i + 1];
                var z = array[i + 2];

                point.set(x, y, z);

                maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(point));
            }

            this.radius = Math.sqrt(maxRadiusSq);

            return this;
        }
    }();

    Sphere.prototype.applyMatrix4 = function(matrix) {
        this.center.applyMatrix4(matrix);
        this.radius = this.radius * matrix.getMaxScaleOnAxis();

        return this;
    }

    Sphere.prototype.getBoundingBox = function(optionalTarget) {
        var box = optionalTarget || new zen3d.Box3();

        box.set(this.center, this.center);
        box.expandByScalar(this.radius);

        return box;
    }

    Sphere.prototype.clone = function() {
        return new Sphere().copy(this);
    }

    Sphere.prototype.copy = function(sphere) {
        this.center.copy(sphere.center);
        this.radius = sphere.radius;

        return this;
    }

    zen3d.Sphere = Sphere;
})();