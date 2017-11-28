/**
 * Reference https://github.com/daishihmr/vox.js
 * @author daishihmr
 * @modifier shawn0326
 */
(function() {
    /**
     * @constructor
     * @property {Object} size {x, y, z}
     * @property {Array} voxels [{x, y, z, colorIndex}...]
     * @property {Array} palette [{r, g, b, a}...]
     */
    var VOXData = function() {
        this.size = null;
        this.voxels = [];
        this.palette = [];

        this.anim = [{
            size: null,
            voxels: [],
        }];
    }

    zen3d.VOXData = VOXData;
})();