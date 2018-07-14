import {LIGHT_TYPE} from '../../const.js';
import {Light} from './Light.js';
import {DirectionalLightShadow} from './DirectionalLightShadow.js';

/**
 * DirectionalLight
 * @class
 */
function DirectionalLight() {
    Light.call(this);

    this.lightType = LIGHT_TYPE.DIRECT;

    this.shadow = new DirectionalLightShadow();
}

DirectionalLight.prototype = Object.assign(Object.create(Light.prototype), {

    constructor: DirectionalLight,

    copy: function(source) {
        Light.prototype.copy.call(this, source);

        this.shadow.copy(source.shadow);
        
        return this;
    }

});

export {DirectionalLight};
