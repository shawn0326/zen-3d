
/**
 * @constructor
 * @property {Object} size {x, y, z}
 * @property {Array} voxels [{x, y, z, colorIndex}...]
 * @property {Array} palette [{r, g, b, a}...]
 */

function VOXData() {
    this.size = null;
    this.voxels = [];
    this.palette = [];

    this.anim = [{
        size: null,
        voxels: [],
    }];
}

export {VOXData};