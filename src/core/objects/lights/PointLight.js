import {LIGHT_TYPE} from '../../const.js';
import {Light} from './Light.js';
import {PointLightShadow} from './PointLightShadow.js';

/**
 * PointLight
 * @class
 */
function PointLight() {
    Light.call(this);

    this.lightType = LIGHT_TYPE.POINT;

    // decay of this light
    this.decay = 2;

    // distance of this light
    this.distance = 200;

    this.shadow = new PointLightShadow();
}

PointLight.prototype = Object.assign(Object.create(Light.prototype), {

    constructor: PointLight,

    copy: function(source) {
        Light.prototype.copy.call(this, source);

        this.shadow.copy(source.shadow);

        return this;
    }
});

export {PointLight};
