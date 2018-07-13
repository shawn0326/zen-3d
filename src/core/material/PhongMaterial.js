import {MATERIAL_TYPE} from '../const.js';
import {Material} from './Material.js';
import {Color3} from '../math/Color3.js';

/**
 * PhongMaterial
 * @class
 */
function PhongMaterial() {
    Material.call(this);

    this.type = MATERIAL_TYPE.PHONG;

    // specular
    this.shininess = 30;
    this.specular = new Color3(0x666666);
    this.specularMap = null;

    this.acceptLight = true;
}

PhongMaterial.prototype = Object.assign(Object.create(Material.prototype), {

    constructor: PhongMaterial,

    copy: function(source) {
        Material.copy.call(this, source);

        this.shininess = source.shininess;
        this.specular.copy(source.specular);
        this.specularMap = source.specularMap;

        return this;
    }

});

export {PhongMaterial};
