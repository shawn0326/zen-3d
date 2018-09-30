import {RenderTarget2D} from './RenderTarget2D.js';
import {TextureCube} from '../texture/TextureCube.js';

/**
 * Render Target that render to cube texture.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.RenderTarget2D
 * @param {number} width - The width of the render target.
 * @param {number} height - The height of the render target.
 */
function RenderTargetCube(width, height) {

    RenderTarget2D.call(this, width, height);

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

RenderTargetCube.prototype = Object.create(RenderTarget2D.prototype);
RenderTargetCube.prototype.constructor = RenderTargetCube;

export {RenderTargetCube};