import {MATERIAL_TYPE} from '../const.js';
import {Material} from './Material.js';
import {Color3} from '../math/Color3.js';

/**
 * A material for shiny surfaces with specular highlights.
 * The material uses a non-physically based Blinn-Phong model for calculating reflectance. 
 * Unlike the Lambertian model used in the {@link zen3d.LambertMaterial} this can simulate shiny surfaces with specular highlights (such as varnished wood).
 * @constructor
 * @extends zen3d.Material
 * @memberof zen3d
 */
function PhongMaterial() {

    Material.call(this);

    this.type = MATERIAL_TYPE.PHONG;

    /**
     * How shiny the {@link zen3d.PhongMaterial#specular} highlight is; a higher value gives a sharper highlight. 
     * @type {number}
     * @default 30
     */
    this.shininess = 30;

    /**
     * Specular color of the material.
     * This defines how shiny the material is and the color of its shine.
     * @type {zen3d.Color3}
     * @default zen3d.Color(0x666666)
     */
    this.specular = new Color3(0x666666);

    /**
     * The specular map value affects both how much the specular surface highlight contributes and how much of the environment map affects the surface.
     * @type {zen3d.Texture2D}
     * @default null
     */
    this.specularMap = null;

    /**
     * Phong material is affected by lights.
     * @type {boolean}
     * @default true
     */
    this.acceptLight = true;

}

PhongMaterial.prototype = Object.assign(Object.create(Material.prototype), /** @lends zen3d.PhongMaterial.prototype */{

    constructor: PhongMaterial,

    copy: function(source) {
        Material.prototype.copy.call(this, source);

        this.shininess = source.shininess;
        this.specular.copy(source.specular);
        this.specularMap = source.specularMap;

        return this;
    }

});

export {PhongMaterial};
