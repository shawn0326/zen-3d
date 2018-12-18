import {RenderTargetBase} from './RenderTargetBase.js';
import {TextureCube} from '../texture/TextureCube.js';
import {ATTACHMENT} from '../const.js';

/**
 * Render Target that render to cube texture.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.RenderTargetBase
 * @param {number} width - The width of the render target.
 * @param {number} height - The height of the render target.
 */
function RenderTargetCube(width, height) {

    RenderTargetBase.call(this, width, height);

    this._textures = {};

    /**
     * The cube texture attached to COLOR_ATTACHMENT0.
     * @type {zen3d.TextureCube}
     * @default zen3d.TextureCube()
     */
    this.texture = new TextureCube();

    /**
     * The activeCubeFace property corresponds to a cube side (PX 0, NX 1, PY 2, NY 3, PZ 4, NZ 5).
     * @type {number}
     * @default 0
     */
    this.activeCubeFace = 0;
}

RenderTargetCube.prototype = Object.create(RenderTargetBase.prototype);
RenderTargetCube.prototype.constructor = RenderTargetCube;

RenderTargetCube.prototype = Object.assign(Object.create(RenderTargetBase.prototype), /** @lends zen3d.RenderTargetCube.prototype */{

    constructor: RenderTargetCube,

    /**
     * Attach a texture(RTT) to the framebuffer.
     * Notice: For now, dynamic Attachment during rendering is not supported.
     * @param  {zen3d.TextureCube} texture
     * @param  {zen3d.ATTACHMENT} [attachment=zen3d.ATTACHMENT.COLOR_ATTACHMENT0]
     */
    attach: function(texture, attachment) {
        var changed = false;

        for (var i = 0; i < 6; i++) {
            if (texture.images[i] && texture.images[i].rtt) {
                if (texture.images[i].width !== this.width || texture.images[i].height !== this.height) {
                    texture.images[i].width = this.width;
                    texture.images[i].height = this.height;
                    changed = true;
                }
            } else {
                texture.images[i] = {rtt: true, data: null, width: this.width, height: this.height};
                changed = true;
            }
        }

        if (changed) {
            texture.version++;
        }

        this._textures[attachment || ATTACHMENT.COLOR_ATTACHMENT0] = texture;
    },

    /**
     * Detach a texture.
     * @param  {zen3d.ATTACHMENT} [attachment=zen3d.ATTACHMENT.COLOR_ATTACHMENT0]
     */
    detach: function(attachment) {
        delete this._textures[attachment || ATTACHMENT.COLOR_ATTACHMENT0];
    },

    /**
     * @override
     */
    resize: function(width, height) {

        var changed = RenderTargetBase.prototype.resize.call(this, width, height);

        if (changed) {
            for (var attachment in this._textures) {
                var texture = this._textures[attachment];

                if (texture) {
                    for (var i = 0; i < 6; i++) {
                        texture.images[i] = {rtt: true, data: null, width: this.width, height: this.height};
                    }
                    texture.version++;
                }
            }
        }

    },

});

Object.defineProperties(RenderTargetCube.prototype, {

    texture: {

        set: function(texture) {
            if (texture) {
                this.attach(texture, ATTACHMENT.COLOR_ATTACHMENT0);
            } else {
                this.detach(ATTACHMENT.COLOR_ATTACHMENT0);
            }
        },

        get: function() {
            return this._textures[ATTACHMENT.COLOR_ATTACHMENT0];
        }

    }

});

export {RenderTargetCube};