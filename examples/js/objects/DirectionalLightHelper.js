(function() {
	var DirectionalLightHelper = function(light, size, color) {
		zen3d.Object3D.call(this);

		this.light = light;

		this.color = color;

		if (size === undefined) size = 1;

		var geometry = new zen3d.Geometry();
		geometry.addAttribute('a_Position', new zen3d.BufferAttribute(new Float32Array([
			-size, size, 0,
			size, size, 0,
			size, -size, 0,
			-size, -size, 0,
			-size, size, 0
		]), 3));
		geometry.computeBoundingBox();
		geometry.computeBoundingSphere();

		var material = new zen3d.LineMaterial();
		material.drawMode = zen3d.DRAW_MODE.LINE_LOOP;

		this.lightPlane = new zen3d.Mesh(geometry, material);
		this.add(this.lightPlane);

		geometry = new zen3d.Geometry();
		geometry.addAttribute('a_Position', new zen3d.BufferAttribute(new Float32Array([
			0, 0, 0, 0, 0, 1
		]), 3));
		geometry.computeBoundingBox();
		geometry.computeBoundingSphere();

		var material = new zen3d.LineMaterial();
		material.drawMode = zen3d.DRAW_MODE.LINE_LOOP;

		this.targetLine = new zen3d.Mesh(geometry, material);
		this.targetLine.scale.z = size * 5;
		this.add(this.targetLine);

		this.update();
	}

	DirectionalLightHelper.prototype = Object.assign(Object.create(zen3d.Object3D.prototype), {
		constructor: DirectionalLightHelper,

		update: function() {
			var v1 = new zen3d.Vector3();

			return function update() {
				if (this.color !== undefined) {
					this.lightPlane.material.diffuse.setHex(this.color);
					this.targetLine.material.diffuse.setHex(this.color);
				} else {
					this.lightPlane.material.diffuse.copy(this.light.color);
					this.targetLine.material.diffuse.copy(this.light.color);
				}
			};
		}()
	});

	zen3d.DirectionalLightHelper = DirectionalLightHelper;
})();