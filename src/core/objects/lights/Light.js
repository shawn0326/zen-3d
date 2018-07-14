import {OBJECT_TYPE} from '../../const.js';
import {Color3} from '../../math/Color3.js';
import {Object3D} from '../Object3D.js';

/**
 * Light
 * @class
 */
function Light() {
    Object3D.call(this);

    this.type = OBJECT_TYPE.LIGHT;

    this.lightType = "";

    // default light color is white
    this.color = new Color3(0xffffff);

    // light intensity, default 1
    this.intensity = 1;
}

Light.prototype = Object.assign(Object.create(Object3D.prototype), {

    constructor: Light,

    copy: function(source) {
        Object3D.prototype.copy.call(this, source);

        this.type = source.type;
        this.lightType = source.lightType;
        this.color.copy(source.color);
        this.intensity = source.intensity;

        return this;
    }

});

export {Light};
