/**
 * SkeletonHelper
 */

zen3d.SkeletonHelper = function(object) {
	function getBoneList(object) {
		var boneList = [];

		if (object && object.type === 'bone') {
			boneList.push(object);
		}

		for (var i = 0; i < object.children.length; i++) {
			boneList.push.apply(boneList, getBoneList(object.children[i]));
		}

		return boneList;
	}

	var bones = getBoneList(object);

	var geometry = new zen3d.Geometry();

	var vertices = [];
	var colors = [];

	var color1 = new zen3d.Color3(0, 0, 1);
	var color2 = new zen3d.Color3(0, 1, 0);

	for (var i = 0; i < bones.length; i++) {
		var bone = bones[i];

		if (bone.parent && bone.parent.type === 'bone') {
			vertices.push(0, 0, 0);
			vertices.push(0, 0, 0);
			colors.push(color1.r, color1.g, color1.b, 1);
			colors.push(color2.r, color2.g, color2.b, 1);
		}
	}

	geometry.addAttribute('a_Position', new zen3d.BufferAttribute(new Float32Array(vertices), 3));
	geometry.addAttribute('a_Color', new zen3d.BufferAttribute(new Float32Array(colors), 4));

	var material = new zen3d.LineMaterial();
	material.vertexColors = zen3d.VERTEX_COLOR.RGBA;
	material.depthTest = false;
	material.depthWrite = false;
	material.transparent = true;

	zen3d.Mesh.call(this, geometry, material);

	this.frustumCulled = false;

	this.root = object;
	this.bones = bones;
}

zen3d.SkeletonHelper.prototype = Object.create(zen3d.Mesh.prototype);
zen3d.SkeletonHelper.prototype.constructor = zen3d.SkeletonHelper;

zen3d.SkeletonHelper.prototype.updateMatrix = function () {
	var vector = new zen3d.Vector3();

	var boneMatrix = new zen3d.Matrix4();
	var worldMatrixInv = new zen3d.Matrix4();

	return function updateMatrix(force) {
		var bones = this.bones;

		var geometry = this.geometry;
		var position = geometry.getAttribute('a_Position');

		worldMatrixInv.getInverse(this.root.worldMatrix);

		for (var i = 0, j = 0; i < bones.length; i++) {
			var bone = bones[i];

			if (bone.parent && bone.parent.type === "bone") {
				boneMatrix.multiplyMatrices(worldMatrixInv, bone.worldMatrix);
				vector.setFromMatrixPosition(boneMatrix);

				position.array[j * position.size + 0] = vector.x;
				position.array[j * position.size + 1] = vector.y;
				position.array[j * position.size + 2] = vector.z;

				boneMatrix.multiplyMatrices(worldMatrixInv, bone.parent.worldMatrix);
				vector.setFromMatrixPosition(boneMatrix);

				position.array[(j + 1) * position.size + 0] = vector.x;
				position.array[(j + 1) * position.size + 1] = vector.y;
				position.array[(j + 1) * position.size + 2] = vector.z;

				j += 2;
			}
		}

		geometry.getAttribute('a_Position').version++;

		zen3d.Mesh.prototype.updateMatrix.call(this, force);
	};
}();