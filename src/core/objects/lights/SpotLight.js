import {LIGHT_TYPE} from '../../const.js';
import {Light} from './Light.js';
import {SpotLightShadow} from './SpotLightShadow.js';

/**
 * This light gets emitted from a single point in one direction, along a cone that increases in size the further from the light it gets.
 * This light can cast shadows - see the {@link zen3d.SpotLightShadow} page for details.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.Light
 */
function SpotLight() {

    Light.call(this);

    this.lightType = LIGHT_TYPE.SPOT;

    /**
     * The amount the light dims along the distance of the light.
     * @type {number}
     * @default 1
     */
    this.decay = 1;

    /**
     * The distance from the light where the intensity is 0.
     * @type {number}
     * @default 200
     */
    this.distance = 200;

    /**
     * Percent of the spotlight cone that is attenuated due to penumbra. 
     * Takes values between zero and 1.
     * @type {number}
     * @default 0
     */
    this.penumbra = 0;

    /**
     * Maximum extent of the spotlight, in radians, from its direction. 
     * Should be no more than Math.PI/2.
     * @type {number}
     * @default Math.PI/6
     */
    this.angle = Math.PI / 6;

    /**
     * A {@link zen3d.SpotLightShadow} used to calculate shadows for this light. 
     * @type {zen3d.SpotLightShadow}
     * @default zen3d.SpotLightShadow()
     */
    this.shadow = new SpotLightShadow();

}

SpotLight.prototype = Object.assign(Object.create(Light.prototype), /** @lends zen3d.SpotLight.prototype */{

    constructor: SpotLight,

    copy: function(source) {
        Light.prototype.copy.call(this, source);

        this.shadow.copy(source.shadow);

        return this;
    }
    
});

export {SpotLight};
