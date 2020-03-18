/**
 * DirectionalLightHelper
 */

import {
	BufferAttribute,
	DRAW_MODE,
	Geometry,
	LineMaterial,
	Mesh,
	Object3D
} from "../../../build/zen3d.module.js";

var DirectionalLightHelper = function(light, size, color) {
	Object3D.call(this);

	this.light = light;

	this.color = color;

	if (size === undefined) size = 1;

	var geometry = new Geometry();
	geometry.addAttribute('a_Position', new BufferAttribute(new Float32Array([
		-size, size, 0,
		size, size, 0,
		size, -size, 0,
		-size, -size, 0,
		-size, size, 0
	]), 3));
	geometry.computeBoundingBox();
	geometry.computeBoundingSphere();

	var material = new LineMaterial();
	material.drawMode = DRAW_MODE.LINE_LOOP;

	this.lightPlane = new Mesh(geometry, material);
	this.add(this.lightPlane);

	geometry = new Geometry();
	geometry.addAttribute('a_Position', new BufferAttribute(new Float32Array([
		0, 0, 0, 0, 0, 1
	]), 3));
	geometry.computeBoundingBox();
	geometry.computeBoundingSphere();

	var material = new LineMaterial();
	material.drawMode = DRAW_MODE.LINE_LOOP;

	this.targetLine = new Mesh(geometry, material);
	this.targetLine.scale.z = size * 5;
	this.add(this.targetLine);

	this.update();
}

DirectionalLightHelper.prototype = Object.assign(Object.create(Object3D.prototype), {
	constructor: DirectionalLightHelper,

	update: function() {
		if (this.color !== undefined) {
			this.lightPlane.material.diffuse.setHex(this.color);
			this.targetLine.material.diffuse.setHex(this.color);
		} else {
			this.lightPlane.material.diffuse.copy(this.light.color);
			this.targetLine.material.diffuse.copy(this.light.color);
		}
	}
});

export { DirectionalLightHelper };