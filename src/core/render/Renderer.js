import {RenderTargetBack} from './RenderTargetBack.js';
import {WebGLCore} from './WebGL/WebGLCore.js';
import {Performance} from '../Performance.js';
import {ShadowMapPass} from './prePass/ShadowMapPass.js';

/**
 * Renderer
 * @class
 */
function Renderer(view, options) {

    this.backRenderTarget = new RenderTargetBack(view);
    
    var gl = view.getContext("webgl", options || {
        antialias: true, // antialias
        alpha: false, // effect performance, default false
        // premultipliedAlpha: false, // effect performance, default false
        stencil: true
    });
    this.glCore = new WebGLCore(gl);

    this.autoClear = true;

    this.performance = new Performance();

    this.shadowMapPass = new ShadowMapPass();

    this.shadowAutoUpdate = true;
    this.shadowNeedsUpdate = false;

    this.matrixAutoUpdate = true;
    this.lightsAutoupdate = true;
}

/**
 * render scene with camera
 */
Renderer.prototype.render = function(scene, camera, renderTarget, forceClear) {
    var performance = this.performance;

    performance.updateFps();

    performance.startCounter("render", 60);

    this.matrixAutoUpdate && scene.updateMatrix();
    this.lightsAutoupdate && scene.updateLights();

    performance.startCounter("renderShadow", 60);   

    if ( this.shadowAutoUpdate || this.shadowNeedsUpdate ) {
        this.shadowMapPass.render(this.glCore, scene);

        this.shadowNeedsUpdate = false;
    }

    performance.endCounter("renderShadow");

    if (renderTarget === undefined) {
        renderTarget = this.backRenderTarget;
    }
    this.glCore.texture.setRenderTarget(renderTarget);

    if (this.autoClear || forceClear) {
        this.glCore.clear(true, true, true);
    }

    performance.startCounter("renderList", 60);
    this.glCore.render(scene, camera, true);
    performance.endCounter("renderList");

    if (!!renderTarget.texture) {
        this.glCore.texture.updateRenderTargetMipmap(renderTarget);
    }

    this.performance.endCounter("render");
}

export {Renderer};