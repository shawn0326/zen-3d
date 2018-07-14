import {RenderTargetBase} from './RenderTargetBase.js';
import {TextureCube} from '../texture/TextureCube.js';

/**
 * RenderTargetCube Class
 * @class
 */
function RenderTargetCube(width, height) {
    RenderTargetBase.call(this, width, height);

    this.texture = new TextureCube();

    this.activeCubeFace = 0; // PX 0, NX 1, PY 2, NY 3, PZ 4, NZ 5
}

RenderTargetCube.prototype = Object.create(RenderTargetBase.prototype);
RenderTargetCube.prototype.constructor = RenderTargetCube;

export {RenderTargetCube};