import {RenderTargetBase} from './RenderTargetBase.js';

/**
 * Render Target that render to canvas element.
 * @constructor
 * @extends RenderTargetBase
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

RenderTargetBack.prototype = Object.assign(Object.create(RenderTargetBase.prototype), {

    constructor: RenderTargetBack,

    /**
     * @memberof RenderTargetBack#
     * @override
     */
    resize: function(width, height) {

        this.view.width = width;
        this.view.height = height;

        this.width = width;
        this.height = height;

    },

    /**
     * @memberof RenderTargetBack#
     * @override
     */
    dispose: function() {
        // TODO dispose canvas?
    }

});

export {RenderTargetBack};