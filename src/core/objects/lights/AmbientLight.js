import {LIGHT_TYPE} from '../../const.js';
import {Light} from './Light.js';

/**
 * AmbientLight
 * @class
 */
function AmbientLight() {
    Light.call(this);

    this.lightType = LIGHT_TYPE.AMBIENT;
}

AmbientLight.prototype = Object.create(Light.prototype);
AmbientLight.prototype.constructor = AmbientLight;

export {AmbientLight};
