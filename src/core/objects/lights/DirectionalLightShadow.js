import {WEBGL_TEXTURE_FILTER} from '../../const.js';
import {LightShadow} from './LightShadow.js';
import {RenderTarget2D} from '../../render/RenderTarget2D.js';
import {Vector3} from '../../math/Vector3.js';

/**
 * DirectionalLightShadow
 * @class
 */
function DirectionalLightShadow() {
    LightShadow.call(this);

    // direct light is just a direction
    // we would not do camera frustum cull, because this light could be any where
    this.camera.frustumCulled = false;

    this.renderTarget = new RenderTarget2D(this.mapSize.x, this.mapSize.y);

    var map = this.renderTarget.texture;
    map.generateMipmaps = false;
    map.minFilter = WEBGL_TEXTURE_FILTER.LINEAR;
    this.map = map;

    // the cast shadow window size
    this.windowSize = 500;

    this._lookTarget = new Vector3();

    this._up = new Vector3(0, 1, 0);
}

DirectionalLightShadow.prototype = Object.assign(Object.create(LightShadow.prototype), {

    constructor: DirectionalLightShadow,

    /**
     * update by light
     */
    update: function(light) {
        this._updateCamera(light);
        this._updateMatrix();

        // TODO check size change, remove this from loop
        if(this.mapSize.x !== this.renderTarget.width || this.mapSize.y !== this.renderTarget.height) {
            this.renderTarget.resize(this.mapSize.x, this.mapSize.y);
        }
    },

    /**
     * update camera matrix by light
     */
    _updateCamera: function(light) {
        var camera = this.camera;
        var lookTarget = this._lookTarget;

        // set camera position and lookAt(rotation)
        light.getWorldDirection(this._lookTarget);
        camera.position.setFromMatrixPosition(light.worldMatrix);
        lookTarget.set(lookTarget.x + camera.position.x, lookTarget.y + camera.position.y, lookTarget.z + camera.position.z);
        camera.lookAt(lookTarget, this._up);

        // update view matrix
        camera.updateMatrix();

        // update projection
        var halfWindowSize = this.windowSize / 2;
        camera.setOrtho(-halfWindowSize, halfWindowSize, -halfWindowSize, halfWindowSize, this.cameraNear, this.cameraFar);
    },

    /**
     * update shadow matrix
     */
    _updateMatrix: function() {
        var matrix = this.matrix;
        var camera = this.camera;

        // matrix * 0.5 + 0.5, after identity, range is 0 ~ 1 instead of -1 ~ 1
        matrix.set(
            0.5, 0.0, 0.0, 0.5,
            0.0, 0.5, 0.0, 0.5,
            0.0, 0.0, 0.5, 0.5,
            0.0, 0.0, 0.0, 1.0
        );

        matrix.multiply(camera.projectionMatrix);
        matrix.multiply(camera.viewMatrix);
    },

    copy: function(source) {
        LightShadow.prototype.copy.call(this, source);

        this.windowSize = source.windowSize;

        return this;
    }

});

export {DirectionalLightShadow};