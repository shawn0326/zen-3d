import {LIGHT_TYPE} from '../../const.js';
import {Light} from './Light.js';

/**
 * This light globally illuminates all objects in the scene equally.
 * This light cannot be used to cast shadows as it does not have a direction.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.Light
 * @param {number} [color=0xffffff]
 * @param {number} [intensity=1]
 */
function AmbientLight( color, intensity ) {

    Light.call(this, color, intensity);

    this.lightType = LIGHT_TYPE.AMBIENT;
    
}

AmbientLight.prototype = Object.create(Light.prototype);
AmbientLight.prototype.constructor = AmbientLight;

export {AmbientLight};
