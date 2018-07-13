function KeyframeAnimation() {

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

Object.assign(KeyframeAnimation.prototype, {

    add: function(clip) {
        this._clips[clip.name] = clip;
    },

    remove: function(clip) {
        delete this._clips[clip.name];
    },

    update: function(t) {
        var currentClip = this._clips[this._currentClipName];
        if(currentClip) {
            currentClip.update(t);
        }
    },

    active: function(name) {
        var clip = this._clips[name];
        if(clip) {
            this._currentClipName = name;
            clip.setFrame(clip.startFrame);// restore
        } else {
            console.warn("KeyframeAnimation: try to active a undefind clip!");
        }
    },

    // return all clip names of this animation
    getAllClipNames: function() {
        var array = [];
        for(var key in this._clips) {
            array.push(key);
        }
        return array;
    }

});

export {KeyframeAnimation};