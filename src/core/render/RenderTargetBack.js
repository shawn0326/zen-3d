import {RenderTargetBase} from './RenderTargetBase.js';

/**
 * RenderTargetBack Class
 * no texture & framebuffer in this render target, but an canvas tag element
 * @class
 */
function RenderTargetBack(view) {
    RenderTargetBase.call(this, view.width, view.height);

    this.view = view; // render to canvas
}

RenderTargetBack.prototype = Object.assign(Object.create(RenderTargetBase.prototype), {

    constructor: RenderTargetBack,

    /**
     * resize render target
     */
    resize: function(width, height) {
        this.view.width = width;
        this.view.height = height;

        this.width = width;
        this.height = height;
    },

    dispose: function() {
        // dispose canvas?
    }

});

export {RenderTargetBack};