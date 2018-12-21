import { MATERIAL_TYPE } from '../const.js';
import { Material } from './Material.js';

/**
 * A material for drawing geometries in a simple shaded (flat or wireframe) way.
 * This material is not affected by lights.
 * @constructor
 * @extends zen3d.Material
 * @memberof zen3d
 */
function BasicMaterial() {
	Material.call(this);

	this.type = MATERIAL_TYPE.BASIC;
}

BasicMaterial.prototype = Object.create(Material.prototype);
BasicMaterial.prototype.constructor = BasicMaterial;

export { BasicMaterial };
