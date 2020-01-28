import { WEBGL_PIXEL_FORMAT } from '../const.js';
import { EventDispatcher } from '../EventDispatcher.js';

/**
 * Render Buffer can be attached to RenderTarget
 * @constructor
 * @memberof zen3d
 * @extends zen3d.EventDispatcher
 */
function RenderBuffer(width, height, format, multipleSampling) {
    EventDispatcher.call(this);

    /**
     * The width of the render buffer.
     * @type {number}
     */
	this.width = width;

	/**
     * The height of the render buffer.
     * @type {number}
     */
	this.height = height;

    /**
     * Render buffer texel storage data format.
     * DEPTH_COMPONENT16: for depth attachments.
     * DEPTH_STENCIL: for depth stencil attachments.
     * RGBA8：for multiple sampled color attachments.
     * DEPTH_COMPONENT16: for multiple sampled depth attachments.
     * DEPTH24_STENCIL8: for multiple sampled depth stencil attachments.
     * @type {zen3d.WEBGL_PIXEL_FORMAT}
     * @default zen3d.WEBGL_PIXEL_FORMAT.RGBA8
     */
    this.format = format !== undefined ? format : WEBGL_PIXEL_FORMAT.RGBA8;

    /**
     * If bigger than zero, this renderBuffer will support multipleSampling. (Only usable in WebGL 2.0)
     * A Render Target's attachments must have the same multipleSampling value.
     * Texture can't be attached to the same render target with a multiple sampled render buffer.
     * Max support 8.
     * @type {number}
     * @default 0
     */
    this.multipleSampling = multipleSampling !== undefined ? multipleSampling : 0;
}

RenderBuffer.prototype = Object.assign(Object.create(EventDispatcher.prototype), /** @lends zen3d.RenderBuffer.prototype */{

    constructor: RenderBuffer,

    isRenderBuffer: true,

    /**
     * Resize the render buffer.
     * @param {number} width - The width of the render buffer.
     * @param {number} height - The height of the render buffer.
     * @return {boolean} - If size changed.
     */
	resize: function(width, height) {
		if (this.width !== width || this.height !== height) {
			this.dispose();
			this.width = width;
			this.height = height;

			return true;
		}

		return false;
	},

    /**
     * Returns a clone of this render buffer.
     * @return {zen3d.RenderBuffer}
     */
	clone: function() {
		return new this.constructor().copy(this);
	},

	/**
     * Copy the given render buffer into this render buffer.
     * @param {zen3d.RenderBuffer} source - The render buffer to be copied.
     * @return {zen3d.RenderBuffer}
     */
	copy: function(source) {
        this.format = source.format;
        this.multipleSampling = source.multipleSampling;

		return this;
	},

	/**
     * Dispatches a dispose event.
     */
	dispose: function() {
		this.dispatchEvent({ type: 'dispose' });
	}

});

export { RenderBuffer };