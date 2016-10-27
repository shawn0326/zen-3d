(function() {
    /**
     * a vector 4 class
     * @class
     */
    var Vector4 = function(x, y, z, w) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = ( w !== undefined ) ? w : 1;
    }

    /**
     * set values of this vector
     **/
    Vector4.prototype.set = function(x, y, z, w) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = ( w !== undefined ) ? w : 1;

        return this;
    }

    /**
     * apply a 4x4 matrix
     */
    Vector4.prototype.applyMatrix4 = function(m) {
		var x = this.x, y = this.y, z = this.z, w = this.w;
		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] * w;
		this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] * w;
		this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] * w;
		this.w = e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] * w;

		return this;
	}

    /**
     * equals
     */
    Vector4.prototype.equals = function(v) {
		return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) && ( v.w === this.w ) );
	}

    /**
     * copy
     */
    Vector4.prototype.copy = function(v) {
        this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		this.w = ( v.w !== undefined ) ? v.w : 1;

		return this;
	}

    zen3d.Vector4 = Vector4;
})();