(function() {

    var range = {key1: 0, value1: 0, key2: 0, value2: 0};

    /*
     * KeyframeTrack
     * used for number property track
     */
    var KeyframeTrack = function(target, propertyPath) {

        this.target = undefined;
        this.path = undefined;

        this.bind(target, propertyPath);

        this.data = new zen3d.KeyframeData();

        this._frame = 0;

        this.interpolant = true;
    }

    KeyframeTrack.prototype.bind = function(target, propertyPath) {
        propertyPath = propertyPath.split(".");

        if (propertyPath.length > 1) {
            var property = target[propertyPath[0]];


            for (var index = 1; index < propertyPath.length - 1; index++) {
                property = property[propertyPath[index]];
            }

            this.path = propertyPath[propertyPath.length - 1];
            this.target = property;
        } else {
            this.path = propertyPath[0];
            this.target = target;
        }
    }

    Object.defineProperties(KeyframeTrack.prototype, {
        frame: {
            get: function() {
                return this._frame;
            },
            set: function(t) {
                // TODO should not out of range
                this._frame = t;
                this._updateValue(t);
            }
        }
    });

    KeyframeTrack.prototype._updateValue = function(t) {
        this.data.getRange(t, range);

        var key1 = range.key1;
        var key2 = range.key2;
        var value1 = range.value1;
        var value2 = range.value2;

        if(this.interpolant) {
            if(value1 !== undefined && value2 !== undefined) {
                var ratio = (t - key1) / (key2 - key1);
                this.target[this.path] = (value2 - value1) * ratio + value1;
            } else {
                this.target[this.path] = value1;
            }
        } else {
            this.target[this.path] = value1;
        }
    }

    zen3d.KeyframeTrack = KeyframeTrack;
})();