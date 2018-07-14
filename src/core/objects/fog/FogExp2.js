import {FOG_TYPE} from '../../const.js';
import {Color3} from '../../math/Color3.js';

/**
 * FogExp2
 * @class
 */
function FogExp2(color, density) {

    this.fogType = FOG_TYPE.EXP2;

    this.color = new Color3( (color !== undefined) ? color : 0x000000 );

    this.density = (density !== undefined) ? density : 0.00025;
}

export {FogExp2};