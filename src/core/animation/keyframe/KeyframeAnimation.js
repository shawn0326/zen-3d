(function() {
    var KeyframeAnimation = function() {
        this._clips = {};

        this._currentClipName = "";
    }

    Object.defineProperties(KeyframeAnimation.prototype, {
        currentClipName: {
            get: function() {
                return this._currentClipName;
            }
        },
        currentClip: {
            get: function() {
                return this._clips[this._currentClipName];
            }
        }
    });

    KeyframeAnimation.prototype.add = function(clip) {
        this._clips[clip.name] = clip;
    }

    KeyframeAnimation.prototype.remove = function(clip) {
        delete this._clips[clip.name];
    }

    KeyframeAnimation.prototype.update = function(t) {
        var currentClip = this._clips[this._currentClipName];
        if(currentClip) {
            currentClip.update(t);
        }
    }

    KeyframeAnimation.prototype.active = function(name) {
        var clip = this._clips[name];
        if(clip) {
            this._currentClipName = name;
            clip.setFrame(clip.startFrame);
        } else {
            console.warn("KeyframeAnimation: try to active a undefind clip!");
        }
    }

    // return all clip names of this animation
    KeyframeAnimation.prototype.getAllClipNames = function() {
        var array = [];
        for(var key in this._clips) {
            array.push(key);
        }
        return array;
    }

    zen3d.KeyframeAnimation = KeyframeAnimation;
})();