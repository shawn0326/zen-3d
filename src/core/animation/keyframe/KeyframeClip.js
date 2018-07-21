function KeyframeClip(name) {

    this.name = name || "";

    this.tracks = [];

    this.loop = true;

    this.startFrame = 0;

    this.endFrame = 0;

    this.frame = 0;

}

Object.assign(KeyframeClip.prototype, {

    update: function(t, bindings, weight) {

        this.frame += t;

        if(this.frame > this.endFrame) {
            if(this.loop) {
                this.frame = this.startFrame;
            } else {
                this.frame = this.endFrame;
            }
        }
        
        for(var i = 0, l = this.tracks.length; i < l; i++) {

            var track = this.tracks[i];

            var bind = bindings[track.name];

            track.getValue(this.frame, bind.buffer);
            bind.accumulate(weight);

        }

    }

});

export {KeyframeClip};