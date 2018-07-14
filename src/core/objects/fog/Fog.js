import {FOG_TYPE} from '../../const.js';
import {Color3} from '../../math/Color3.js';

/**
 * Fog
 * @class
 */
function Fog(color, near, far) {

    this.fogType = FOG_TYPE.NORMAL;

    this.color = new Color3( (color !== undefined) ? color : 0x000000 );

    this.near = (near !== undefined) ? near : 1;
    this.far = (far !== undefined) ? far : 1000;
}

export {Fog};