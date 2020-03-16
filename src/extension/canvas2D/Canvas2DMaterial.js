/**
 * Canvas2DMaterial
 * @class
 */
class Canvas2DMaterial extends zen3d.Material {

	constructor() {
		super();
		this.type = zen3d.MATERIAL_TYPE.CANVAS2D;

		this.depthWrite = false;

		this.transparent = true;
	}

}

export { Canvas2DMaterial };
