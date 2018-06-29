(function() {

    /**
     * @author bhouston / http://clara.io
     * @author WestLangley / http://github.com/WestLangley
     * @author shawn0326 / http://halflab.me
     *
     * Ref: https://en.wikipedia.org/wiki/Spherical_coordinate_system
     *
     * The poles (phi) are at the positive and negative y axis.
     * The equator starts at positive z.
     */

    var Spherical = function(radius, phi, theta) {
        this.radius = ( radius !== undefined ) ? radius : 1.0;
        this.phi = ( phi !== undefined ) ? phi : 0; // up / down towards top and bottom pole
        this.theta = ( theta !== undefined ) ? theta : 0; // around the equator of the sphere
    }

    Spherical.prototype.set = function(radius, phi, theta) {
        this.radius = radius;
		this.phi = phi;
		this.theta = theta;

		return this;
    }

    Spherical.prototype.copy = function(other) {
        this.radius = other.radius;
		this.phi = other.phi;
		this.theta = other.theta;

		return this;
    }

    Spherical.prototype.clone = function() {
        return new this.constructor().copy(this);
    }

    // restrict phi to be betwee EPS and PI-EPS
    Spherical.prototype.makeSafe = function() {
        var EPS = 0.000001;
		this.phi = Math.max( EPS, Math.min( Math.PI - EPS, this.phi ) );

		return this;
    }

    Spherical.prototype.setFromVector3 = function(vec3) {
        this.radius = vec3.getLength();

		if ( this.radius === 0 ) {

			this.theta = 0;
			this.phi = 0;

		} else {

			this.theta = Math.atan2( vec3.x, vec3.z ); // equator angle around y-up axis
			this.phi = Math.acos( Math.min(1, Math.max(-1, vec3.y / this.radius)) ); // polar angle

		}

		return this;
    }

    zen3d.Spherical = Spherical;
});