import { EventDispatcher } from '../EventDispatcher.js';

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
     * The width of the render target.
     * @type {number}
     */
	this.width = width;

	/**
     * The height of the render target.
     * @type {number}
     */
	this.height = height;
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
		if (this.width !== width || this.height !== height) {
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
		this.dispatchEvent({ type: 'dispose' });
	}

});

export { RenderTargetBase };