(function() {
    /**
     * a vector 2 class
     * @class
     */
    var Vector2 = function(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    /**
     * set values of this vector
     **/
    Vector2.prototype.set = function(x, y) {
        this.x = x || 0;
        this.y = y || 0;

        return this;
    }

    Vector2.prototype.min = function(v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);

        return this;
    }

    Vector2.prototype.max = function(v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);

        return this;
    }

    Vector2.prototype.getLength = function() {
        return Math.sqrt(this.getLengthSquared());
    }

    Vector2.prototype.getLengthSquared = function() {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * normalize
     **/
    Vector2.prototype.normalize = function(thickness) {
        thickness = thickness || 1;
        var length = this.getLength();
        if (length != 0) {
            var invLength = thickness / length;
            this.x *= invLength;
            this.y *= invLength;
            return this;
        }
    }

    /**
     * subtract a vector and return a new instance
     **/
    Vector2.prototype.subtract = function(a, target) {
        if (!target) {
            target = new Vector2();
        }
        target.set(this.x - a.x, this.y - a.y);
        return target;
    }

    /**
     * copy
     */
    Vector2.prototype.copy = function(v) {
        this.x = v.x;
        this.y = v.y;

        return this;
    }

    /**
     * addVectors
     */
    Vector2.prototype.addVectors = function(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;

        return this;
    }

    /**
     * multiplyScalar
     */
    Vector2.prototype.multiplyScalar = function(scalar) {
        this.x *= scalar;
        this.y *= scalar;

        return this;
    }

    /**
     * distanceToSquared
     */
    Vector2.prototype.distanceToSquared = function(v) {
        var dx = this.x - v.x,
            dy = this.y - v.y;

        return dx * dx + dy * dy;
    }

    /**
     * distanceTo
     */
    Vector2.prototype.distanceTo = function(v) {
        return Math.sqrt(this.distanceToSquared(v));
    }

    zen3d.Vector2 = Vector2;
})();