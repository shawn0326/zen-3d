/**
 * GridHelper
 */

import {
	BufferAttribute,
	Color3,
	Geometry,
	LineMaterial,
	Mesh,
	VERTEX_COLOR
} from "../../../build/zen3d.module.js";

var GridHelper = function(size, divisions, color1, color2) {
	size = size || 10;
	divisions = divisions || 10;
	color1 = new Color3(color1 !== undefined ? color1 : 0x444444);
	color2 = new Color3(color2 !== undefined ? color2 : 0x888888);

	var center = divisions / 2;
	var step = size / divisions;
	var halfSize = size / 2;

	var vertices = [], colors = [];

	for (var i = 0, j = 0, k = -halfSize; i <= divisions; i++, k += step) {
		vertices.push(-halfSize, 0, k, halfSize, 0, k);
		vertices.push(k, 0, -halfSize, k, 0, halfSize);

		var color = i === center ? color1 : color2;

		color.toArray(colors, j); colors[j + 3] = 1; j += 4;
		color.toArray(colors, j); colors[j + 3] = 1; j += 4;
		color.toArray(colors, j); colors[j + 3] = 1; j += 4;
		color.toArray(colors, j); colors[j + 3] = 1; j += 4;
	}

	var geometry = new Geometry();
	geometry.addAttribute('a_Position', new BufferAttribute(new Float32Array(vertices), 3));
	geometry.addAttribute('a_Color', new BufferAttribute(new Float32Array(colors), 4));

	geometry.computeBoundingBox();
	geometry.computeBoundingSphere();

	var material = new LineMaterial();
	material.vertexColors = VERTEX_COLOR.RGBA;

	Mesh.call(this, geometry, material);

	// this.frustumCulled = false;
}

GridHelper.prototype = Object.create(Mesh.prototype);
GridHelper.prototype.constructor = GridHelper;

export { GridHelper };