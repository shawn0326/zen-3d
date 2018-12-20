import { OBJECT_TYPE } from '../../const.js';
import { Color3 } from '../../math/Color3.js';
import { Object3D } from '../Object3D.js';

/**
 * Abstract base class for lights
 * - all other light types inherit the properties and methods described here.
 * @constructor
 * @abstract
 * @memberof zen3d
 * @extends zen3d.Object3D
 * @param {number} [color=0xffffff]
 * @param {number} [intensity=1]
 */
function Light(color, intensity) {

    Object3D.call(this);

    this.type = OBJECT_TYPE.LIGHT;

    this.lightType = "";

    /**
     * Color of the light.
     * @type {zen3d.Color3}
     * @default zen3d.Color3(0xffffff)
     */
    this.color = new Color3(color !== undefined ? color : 0xffffff);

    /**
     * The light's intensity, or strength.
     * @type {number}
     * @default 1
     */
    this.intensity = (intensity !== undefined) ? intensity : 1;

}

Light.prototype = Object.assign(Object.create(Object3D.prototype), /** @lends zen3d.Light.prototype */{

    constructor: Light,

    /**
     * Copies properties from the source light into this one.
     * @param {zen3d.Light} source - The source light.
     * @return {zen3d.Light} - This light.
     */
    copy: function(source) {
        Object3D.prototype.copy.call(this, source);

        this.type = source.type;
        this.lightType = source.lightType;
        this.color.copy(source.color);
        this.intensity = source.intensity;

        return this;
    }

});

export { Light };
