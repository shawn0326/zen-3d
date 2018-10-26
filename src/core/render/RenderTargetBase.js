import {generateUUID} from '../base.js';
import {EventDispatcher} from '../EventDispatcher.js';

/**
 * Render Target is the wrapping class of gl.framebuffer.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.EventDispatcher
 * @abstract
 * @param {number} width - The width of the render target.
 * @param {number} height - The height of the render target.
 */
function RenderTargetBase(width, height) {

    EventDispatcher.call(this);

    /**
     * UUID of this render target instance. 
     * This gets automatically assigned, so this shouldn't be edited.
     * @type {string}
     */
    this.uuid = generateUUID();

    /**
     * The width of the render target.
     * @type {number}
     */
    this.width = width;

    /**
     * The height of the render target.
     * @type {number}
     */
    this.height = height;

    /**
     * If set true, attach a depth render buffer to the redner target.
     * @type {boolean}
     * @default true
     */
    this.depthBuffer = true;

    /**
     * If set true, attach a stencil render buffer to the redner target.
     * @type {boolean}
     * @default true
     */
    this.stencilBuffer = true;

    /**
     * If bigger than zero, this render target will attach renderBuffer for multipleSampling. (Only usable in WebGL 2.0)
     * Texture witch attached to ATTACHMENT0 will be detached.
     * @type {number}
     * @default 0
     */
    this.multipleSampling = 0;

}

RenderTargetBase.prototype = Object.assign(Object.create(EventDispatcher.prototype), /** @lends zen3d.RenderTargetBase.prototype */{

    constructor: RenderTargetBase,

    /**
     * Resize the render target.
     * @param {number} width - The width of the render target.
     * @param {number} height - The height of the render target.    
     * @return {boolean} - If size changed.
     */
    resize: function(width, height) {

        if(this.width !== width || this.height !== height) {
            this.dispose();
            this.width = width;
            this.height = height;

            return true;
        }

        return false;

    },

    /**
     * Dispatches a dispose event.
     */
    dispose: function() {
        this.dispatchEvent({type: 'dispose'});
    }

});

export {RenderTargetBase};