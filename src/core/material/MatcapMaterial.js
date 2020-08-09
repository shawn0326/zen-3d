import { MATERIAL_TYPE } from '../const.js';
import { Material } from './Material.js';

/**
 * MatcapMaterial is defined by a MatCap (or Lit Sphere) texture, which encodes the material color and shading.
 * MatcapMaterial does not respond to lights since the matcap image file encodes baked lighting.
 * It will cast a shadow onto an object that receives shadows (and shadow clipping works), but it will not self-shadow or receive shadows.
 * @constructor
 * @extends zen3d.Material
 * @memberof zen3d
 */
function MatcapMaterial() {
	Material.call(this);

	this.type = MATERIAL_TYPE.MATCAP;

	/**
     * The matcap map.
     * @type {zen3d.Texture2D}
     * @default null
     */
	this.matcap = null;
}

MatcapMaterial.prototype = Object.assign(Object.create(Material.prototype), /** @lends zen3d.MatcapMaterial.prototype */{

	constructor: MatcapMaterial,

	copy: function(source) {
		Material.prototype.copy.call(this, source);

		this.matcap = source.matcap;

		return this;
	}

});

export { MatcapMaterial };
