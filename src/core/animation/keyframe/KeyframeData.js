function KeyframeData() {
    this._keys = [];
    this._values = [];
}

Object.assign(KeyframeData.prototype, {

    addFrame: function(key, value) {
        this._keys.push(key);
        this._values.push(value);
    },

    removeFrame: function(key) {
        var index = this.keys.indexOf(key);
        if (index > -1) {
            this._keys.splice(index, 1);
            this._values.splice(index, 1);
        }
    },

    clearFrame: function() {
        this._keys.length = 0;
        this._values.length = 0;
    },

    sortFrame: function() {
        // TODO
    },

    // return a frame range between two key frames
    // return type: {key1: 0, value1: 0, key2: 0, value2: 0}
    getRange: function(t, result) {
        var lastIndex = this._getLastKeyIndex(t);

        var key1 = this._keys[lastIndex];
        var key2 = this._keys[lastIndex + 1];
        var value1 = this._values[lastIndex];
        var value2 = this._values[lastIndex + 1];

        result = result || {key1: 0, value1: 0, key2: 0, value2: 0};

        result.key1 = key1;
        result.key2 = key2;
        result.value1 = value1;
        result.value2 = value2;

        return result;
    },

    _getLastKeyIndex: function(t) {
        var lastKeyIndex = 0;
        var i, l = this._keys.length;
        for(i = 0; i < l; i++) {
            if(t >= this._keys[i]) {
                lastKeyIndex = i;
            }
        }
        return lastKeyIndex;
    }

});

export {KeyframeData};