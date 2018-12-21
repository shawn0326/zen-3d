import { RenderTargetBase } from './RenderTargetBase.js';

/**
 * Render Target that render to canvas element.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.RenderTargetBase
 * @param {HTMLCanvasElement} view - The canvas element which the Render Target rendered to.
 */
function RenderTargetBack(view) {
	RenderTargetBase.call(this, view.width, view.height);

	/**
     * The canvas element which the Render Target rendered to.
     * @type {HTMLCanvasElement}
     */
	this.view = view;
}

RenderTargetBack.prototype = Object.assign(Object.create(RenderTargetBase.prototype), /** @lends zen3d.RenderTargetBack.prototype */{

	constructor: RenderTargetBack,

	resize: function(width, height) {
		this.view.width = width;
		this.view.height = height;

		this.width = width;
		this.height = height;
	},

	dispose: function() {
		// TODO dispose canvas?
	}

});

export { RenderTargetBack };