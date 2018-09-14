import {LIGHT_TYPE} from '../../const.js';
import {Light} from './Light.js';

/**
 * This light globally illuminates all objects in the scene equally.
 * This light cannot be used to cast shadows as it does not have a direction.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.Light
 */
function AmbientLight() {

    Light.call(this);

    this.lightType = LIGHT_TYPE.AMBIENT;
    
}

AmbientLight.prototype = Object.create(Light.prototype);
AmbientLight.prototype.constructor = AmbientLight;

export {AmbientLight};
