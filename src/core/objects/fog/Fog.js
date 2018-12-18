import {FOG_TYPE} from '../../const.js';
import {Color3} from '../../math/Color3.js';

/**
 * Linear fog.
 * @memberof zen3d
 * @constructor
 * @param {number} [color=0x000000] - The color of the fog.
 * @param {number} [near=1] - The near clip of the fog.
 * @param {number} [far=1000] - The far clip of the fog.
 */
function Fog(color, near, far) {

    this.fogType = FOG_TYPE.NORMAL;

    /**
     * The color of the fog.
     * @member {zen3d.Color3}
     * @default zen3d.Color3(0x000000)
     */
    this.color = new Color3((color !== undefined) ? color : 0x000000);

    /**
     * The near clip of the fog.
     * @member {number}
     * @default 1
     */
    this.near = (near !== undefined) ? near : 1;

    /**
     * The far clip of the fog.
     * @member {number}
     * @default 1000
     */
    this.far = (far !== undefined) ? far : 1000;
}

export {Fog};