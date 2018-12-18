function Performance() {
    this._entities = {};

    this.enableCounter = false;
}

Object.assign(Performance.prototype, {

    getEntity: function(key) {
        return this._entities[key];
    },

    getFps: function() {
        var entity = this.getEntity("fps");
        return (entity && entity.averageDelta) ? Math.floor(1000 / entity.averageDelta) : 0;
    },

    updateFps: function() {
        if (!this.enableCounter) {
            return;
        }
        this.endCounter("fps");
        this.startCounter("fps", 60);
    },

    getNow: function() {
        if (window.performance) {
            return window.performance.now();
        }
        return new Date().getTime();
    },

    startCounter: function(key, averageRange) {
        if (!this.enableCounter) {
            return;
        }

        var entity = this._entities[key];
        if (!entity) {
            entity = {
                start: 0,
                end: 0,
                delta: 0,
                _cache: [],
                averageRange: 1,
                averageDelta: 0
            };
            this._entities[key] = entity;
        }
        entity.start = this.getNow();
        entity.averageRange = averageRange || 1;
    },

    endCounter: function(key) {
        if (!this.enableCounter) {
            return;
        }

        var entity = this._entities[key];
        if (entity) {
            entity.end = this.getNow();
            entity.delta = entity.end - entity.start;

            if (entity.averageRange > 1) {
                entity._cache.push(entity.delta);
                var length = entity._cache.length;
                if (length >= entity.averageRange) {
                    if (length > entity.averageRange) {
                        entity._cache.shift();
                        length--;
                    }
                    var sum = 0;
                    for (var i = 0; i < length; i++) {
                        sum += entity._cache[i];
                    }
                    entity.averageDelta = sum / length;
                }
            }
        }
    }

});

export {Performance};