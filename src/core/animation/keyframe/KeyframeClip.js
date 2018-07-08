(function() {

    function KeyframeClip(name) {

        this.name = name || "";

        this.tracks = [];

        this.loop = true;

        this.startFrame = 0;

        this.endFrame = 0;

        this.frame = 0;

    }

    KeyframeClip.prototype = Object.assign(KeyframeClip.prototype, {

        update: function(t) {
            this.frame += t;
    
            if(this.frame > this.endFrame) {
                if(this.loop) {
                    this.frame = this.startFrame;
                } else {
                    this.frame = this.endFrame;
                }
            }
    
            this.setFrame(this.frame);
        },

        setFrame: function(frame) {
            for(var i = 0, l = this.tracks.length; i < l; i++) {
                this.tracks[i].frame = frame;
            }
    
            this.frame = frame;
        }

    });

    // exports
    zen3d.KeyframeClip = KeyframeClip;

})();