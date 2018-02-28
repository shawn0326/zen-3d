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
        return this.normal.dot(point) + this.constant;
    }

    Plane.prototype.coplanarPoint = function ( optionalTarget ) {
		var result = optionalTarget || new Vector3();

		return result.copy( this.normal ).multiplyScalar( - this.constant );
	}

    Plane.prototype.copy = function(plane) {
        this.normal.copy(plane.normal);
        this.constant = plane.constant;
        return this;
    }

    Plane.prototype.applyMatrix4 = function() {

        var v1 = new zen3d.Vector3();
		var m1 = new zen3d.Matrix3();

        return function applyMatrix4(matrix, optionalNormalMatrix) {
            var normalMatrix = optionalNormalMatrix || m1.setFromMatrix4( matrix ).inverse().transpose();

			var referencePoint = this.coplanarPoint( v1 ).applyMatrix4( matrix );

			var normal = this.normal.applyMatrix3( normalMatrix ).normalize();

			this.constant = - referencePoint.dot( normal );

			return this;
        }

    }();

    zen3d.Plane = Plane;
})();