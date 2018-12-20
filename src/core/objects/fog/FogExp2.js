import { FOG_TYPE } from '../../const.js';
import { Color3 } from '../../math/Color3.js';

/**
 * Exp2 fog.
 * @memberof zen3d
 * @constructor
 * @param {number} [color=0x000000] - The color of the fog.
 * @param {number} [density=0.00025] - The density of the exp2 fog.
 */
function FogExp2(color, density) {

    this.fogType = FOG_TYPE.EXP2;

    /**
     * The color of the fog.
     * @member {zen3d.Color3}
     * @default zen3d.Color3(0x000000)
     */
    this.color = new Color3((color !== undefined) ? color : 0x000000);

    /**
     * The density of the exp2 fog.
     * @member {number}
     * @default 0.00025
     */
    this.density = (density !== undefined) ? density : 0.00025;
}

export { FogExp2 };