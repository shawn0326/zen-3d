(function() {
    var Box2 = function(min, max) {
        this.min = (min !== undefined) ? min : new zen3d.Vector2(+Infinity, +Infinity);
        this.max = (max !== undefined) ? max : new zen3d.Vector2(-Infinity, -Infinity);
    }

    Box2.prototype.set = function(x1, y1, x2, y2) {
        this.min.set(x1, y1);
        this.max.set(x2, y2);
    }

    Box2.prototype.copy = function(box) {
        this.min.copy(box.min);
        this.max.copy(box.max);

        return this;
    }

    zen3d.Box2 = Box2;
})();