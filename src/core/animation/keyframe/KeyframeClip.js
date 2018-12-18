/**
 * An KeyframeClip is a reusable set of keyframe tracks which represent an animation.
 * @constructor
 * @memberof zen3d
 * @param {string} [name=""]
 */
function KeyframeClip(name) {

    /**
     * The name of the clip.
     * @type {string}
     */
    this.name = name || "";

    /**
     * All tracks for this clip.
     * @type {zen3d.KeyframeTrack[]}
     */
    this.tracks = [];

    /**
     * @type {boolean}
     * @default true
     */
    this.loop = true;

    /**
     * Start frame.
     * @type {number}
     * @default 0
     */
    this.startFrame = 0;

    /**
     * End frame.
     * @type {number}
     * @default 0
     */
    this.endFrame = 0;

    this.frame = 0;

}

Object.assign(KeyframeClip.prototype, /** @lends zen3d.KeyframeClip.prototype */{

    /**
     * Update tracks.
     * @param {number} t
     * @param {Object} bindings
     * @param {number} weight
     */
    update: function(t, bindings, weight) {

        this.frame += t;

        if (this.frame > this.endFrame) {
            if (this.loop) {
                this.frame = this.startFrame;
            } else {
                this.frame = this.endFrame;
            }
        }

        for (var i = 0, l = this.tracks.length; i < l; i++) {

            var track = this.tracks[i];

            var bind = bindings[track.name];

            track.getValue(this.frame, bind.buffer);
            bind.accumulate(weight);

        }

    }

});

export {KeyframeClip};