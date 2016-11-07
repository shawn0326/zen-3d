(function() {
    var Plane = function(normal, constant) {
        this.normal = (normal !== undefined) ? normal : new zen3d.Vector3(1, 0, 0);
        this.constant = (constant !== undefined) ? constant : 0;
    }

    Plane.prototype.set = function(normal, constant) {
        this.normal.copy(normal);
        this.constant = constant;

        return this;
    }

    Plane.prototype.setComponents = function(x, y, z, w) {
        this.normal.set(x, y, z);
        this.constant = w;

        return this;
    }

    Plane.prototype.normalize = function() {
        // Note: will lead to a divide by zero if the plane is invalid.

        var inverseNormalLength = 1.0 / this.normal.getLength();
        this.normal.multiplyScalar(inverseNormalLength);
        this.constant *= inverseNormalLength;

        return this;
    }

    Plane.prototype.distanceToPoint = function(point) {
        return this.normal.dotProduct(point) + this.constant;
    }

    zen3d.Plane = Plane;
})();