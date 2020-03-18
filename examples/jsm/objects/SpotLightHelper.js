/**
 * SpotLightHelper
 */

import {
	BufferAttribute,
	Geometry,
	LineMaterial,
	Mesh,
	Object3D
} from "../../../build/zen3d.module.js";

var SpotLightHelper = function(light, color) {
	Object3D.call(this);

	this.light = light;

	this.color = color;

	var geometry = new Geometry();

	var positions = [
		0, 0, 0, 	0, 0, 1,
		0, 0, 0, 	1, 0, 1,
		0, 0, 0,	-1, 0, 1,
		0, 0, 0, 	0, 1, 1,
		0, 0, 0, 	0, -1, 1
	];

	for (var i = 0, j = 1, l = 32; i < l; i++, j++) {
		var p1 = (i / l) * Math.PI * 2;
		var p2 = (j / l) * Math.PI * 2;

		positions.push(
			Math.cos(p1), Math.sin(p1), 1,
			Math.cos(p2), Math.sin(p2), 1
		);
	}

	geometry.addAttribute('a_Position', new BufferAttribute(new Float32Array(positions), 3));

	geometry.computeBoundingBox();
	geometry.computeBoundingSphere();

	var material = new LineMaterial();

	this.cone = new Mesh(geometry, material);
	this.add(this.cone);

	this.update();
};

SpotLightHelper.prototype = Object.assign(Object.create(Object3D.prototype), {

	constructor: SpotLightHelper,

	update: function() {
		var coneLength = this.light.distance ? this.light.distance : 1000;
		var coneWidth = coneLength * Math.tan(this.light.angle);

		this.cone.scale.set(coneWidth, coneWidth, coneLength);

		if (this.color !== undefined) {
			this.cone.material.diffuse.setHex(this.color);
		} else {
			this.cone.material.diffuse.copy(this.light.color);
		}
	}

});

export { SpotLightHelper };