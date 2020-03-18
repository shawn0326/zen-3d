/**
 * PointLightHelper
 */

import {
	LineMaterial,
	Mesh,
	SphereGeometry
} from "../../../build/zen3d.module.js";

var PointLightHelper = function(light, sphereSize, color) {
	this.light = light;

	this.color = color;

	var geometry = new SphereGeometry(sphereSize, 4, 2);
	var material = new LineMaterial();

	Mesh.call(this, geometry, material);

	this.update();
};

PointLightHelper.prototype = Object.assign(Object.create(Mesh.prototype), {

	constructor: PointLightHelper,

	update: function() {
		if (this.color !== undefined) {
			this.material.diffuse.setHex(this.color);
		} else {
			this.material.diffuse.copy(this.light.color);
		}
	}

});

export { PointLightHelper };