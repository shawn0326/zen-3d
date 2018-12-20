import { LIGHT_TYPE } from '../../const.js';
import { Light } from './Light.js';
import { DirectionalLightShadow } from './DirectionalLightShadow.js';

/**
 * A light that gets emitted in a specific direction.
 * This light will behave as though it is infinitely far away and the rays produced from it are all parallel.
 * The common use case for this is to simulate daylight; the sun is far enough away that its position can be considered to be infinite, and all light rays coming from it are parallel.
 * This light can cast shadows - see the {@link zen3d.DirectionalLightShadow} page for details.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.Light
 * @param {number} [color=0xffffff]
 * @param {number} [intensity=1]
 */
function DirectionalLight(color, intensity) {

    Light.call(this, color, intensity);

    this.lightType = LIGHT_TYPE.DIRECT;

    /**
     * A {@link zen3d.DirectionalLightShadow} used to calculate shadows for this light.
     * @type {zen3d.DirectionalLightShadow}
     * @default zen3d.DirectionalLightShadow()
     */
    this.shadow = new DirectionalLightShadow();

}

DirectionalLight.prototype = Object.assign(Object.create(Light.prototype), /** @lends zen3d.DirectionalLight.prototype */{

    constructor: DirectionalLight,

    copy: function(source) {
        Light.prototype.copy.call(this, source);

        this.shadow.copy(source.shadow);

        return this;
    }

});

export { DirectionalLight };
