/**
 * @author bhouston / http://clara.io
 * @author WestLangley / http://github.com/WestLangley
 * @author shawn0326 / http://halflab.me
 *
 * Ref: https://en.wikipedia.org/wiki/Spherical_coordinate_system
 *
 * The poles (phi) are at the positive and negative y axis.
 * The equator starts at positive z.
 * @constructor
 * @memberof zen3d
 * @param {number} [radius=1]
 * @param {number} [phi=0]
 * @param {number} [theta=0]
 */
function Spherical(radius, phi, theta) {
    this.radius = (radius !== undefined) ? radius : 1.0;
    this.phi = (phi !== undefined) ? phi : 0; // up / down towards top and bottom pole
    this.theta = (theta !== undefined) ? theta : 0; // around the equator of the sphere
}

Object.assign(Spherical.prototype, /** @lends zen3d.Spherical.prototype */{

    /**
     *
     */
    set: function(radius, phi, theta) {
        this.radius = radius;
        this.phi = phi;
        this.theta = theta;

        return this;
    },

    /**
     *
     */
    copy: function(other) {
        this.radius = other.radius;
        this.phi = other.phi;
        this.theta = other.theta;

        return this;
    },

    /**
     *
     */
    clone: function() {
        return new this.constructor().copy(this);
    },

    /**
     * Restrict phi to be betwee EPS and PI-EPS.
     */
    makeSafe: function() {
        var EPS = 0.000001;
        this.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.phi));

        return this;
    },

    /**
     *
     */
    setFromVector3: function(vec3) {
        this.radius = vec3.getLength();

        if (this.radius === 0) {

            this.theta = 0;
            this.phi = 0;

        } else {

            this.theta = Math.atan2(vec3.x, vec3.z); // equator angle around y-up axis
            this.phi = Math.acos(Math.min(1, Math.max(-1, vec3.y / this.radius))); // polar angle

        }

        return this;
    }

});

export { Spherical };