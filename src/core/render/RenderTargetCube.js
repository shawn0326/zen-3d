import {RenderTargetBase} from './RenderTargetBase.js';
import {TextureCube} from '../texture/TextureCube.js';

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
     * @override   
     */
    resize: function(width, height) {

        RenderTargetBase.prototype.resize.call(this, width, height);

        if (this._texture) {
            this._texture.version++;
            for (var i = 0; i < 6; i++) {
                this._texture.images[i] = {data: null, width: this.width, height: this.height};
            }
        }

    },

});

Object.defineProperties(RenderTargetCube.prototype, {

    texture: {

        set: function(texture) {
            if (texture) {
                texture.version++;
                for (var i = 0; i < 6; i++) {
                    texture.images[i] = {data: null, width: this.width, height: this.height};
                }
            }
            
            this._texture = texture;
        },

        get: function() {
            return this._texture;
        }

    }

});

export {RenderTargetCube};