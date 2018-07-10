(function() {

    // imports
    var Vector3 = zen3d.Vector3;
    var Matrix3 = zen3d.Matrix3;

    function Plane(normal, constant) {
        this.normal = (normal !== undefined) ? normal : new Vector3(1, 0, 0);
        this.constant = (constant !== undefined) ? constant : 0;
    }

    Plane.prototype = Object.assign(Plane.prototype, {

        set: function(normal, constant) {
            this.normal.copy(normal);
            this.constant = constant;
    
            return this;
        },

        setComponents: function(x, y, z, w) {
            this.normal.set(x, y, z);
            this.constant = w;
    
            return this;
        },

        normalize: function() {
            // Note: will lead to a divide by zero if the plane is invalid.
    
            var inverseNormalLength = 1.0 / this.normal.getLength();
            this.normal.multiplyScalar(inverseNormalLength);
            this.constant *= inverseNormalLength;
    
            return this;
        },

        distanceToPoint: function(point) {
            return this.normal.dot(point) + this.constant;
        },

        coplanarPoint: function ( optionalTarget ) {
            var result = optionalTarget || new Vector3();
    
            return result.copy( this.normal ).multiplyScalar( - this.constant );
        },

        copy: function(plane) {
            this.normal.copy(plane.normal);
            this.constant = plane.constant;
            return this;
        },

        applyMatrix4: function() {

            var v1 = new Vector3();
            var m1 = new Matrix3();
    
            return function applyMatrix4(matrix, optionalNormalMatrix) {
                var normalMatrix = optionalNormalMatrix || m1.setFromMatrix4( matrix ).inverse().transpose();
    
                var referencePoint = this.coplanarPoint( v1 ).applyMatrix4( matrix );
    
                var normal = this.normal.applyMatrix3( normalMatrix ).normalize();
    
                this.constant = - referencePoint.dot( normal );
    
                return this;
            }
    
        }()

    });

    // exports
    zen3d.Plane = Plane;
    
})();