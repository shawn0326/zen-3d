import { MATERIAL_TYPE } from '../const.js';
import { Material } from './Material.js';

/**
 * A material for drawing geometry by distance.
 * @constructor
 * @extends zen3d.Material
 * @memberof zen3d
 */
function DistanceMaterial() {
	Material.call(this);

	this.type = MATERIAL_TYPE.DISTANCE;
}

DistanceMaterial.prototype = Object.create(Material.prototype);
DistanceMaterial.prototype.constructor = DistanceMaterial;

export { DistanceMaterial };