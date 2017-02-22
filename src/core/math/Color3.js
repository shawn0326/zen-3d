(function() {
    var Color3 = function(r, g, b) {
        this.r = 0;
        this.g = 0;
        this.b = 0;

        if(g === undefined && b === undefined) {
            return this.setHex(r);
        }

        return this.setRGB(r, g, b);
    }

    /**
     * copy
     */
    Color3.prototype.copy = function(v) {
        this.r = v.r;
        this.g = v.g;
        this.b = v.b;

        return this;
    }

    // set from hex
    Color3.prototype.setHex = function(hex) {
        hex = Math.floor(hex);

        this.r = (hex >> 16 & 255) / 255;
        this.g = (hex >> 8 & 255) / 255;
        this.b = (hex & 255) / 255;

        return this;
    }

    // set from RGB
    Color3.prototype.setRGB = function(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;

        return this;
    }

    // set from HSL
    Color3.prototype.setHSL = function() {

        function euclideanModulo(n, m) {
            return ((n % m) + m) % m;
        }

        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
            return p;
        }

        return function setHSL(h, s, l) {
            // h,s,l ranges are in 0.0 - 1.0
            h = euclideanModulo(h, 1);
            s = Math.max(0, Math.min(1, s));
            l = Math.max(0, Math.min(1, l));

            if (s === 0) {
                this.r = this.g = this.b = l;
            } else {
                var p = l <= 0.5 ? l * (1 + s) : l + s - (l * s);
                var q = (2 * l) - p;

                this.r = hue2rgb(q, p, h + 1 / 3);
                this.g = hue2rgb(q, p, h);
                this.b = hue2rgb(q, p, h - 1 / 3);
            }
            return this;
        };

    }();

    zen3d.Color3 = Color3;
})();