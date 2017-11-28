/**
 * Reference https://github.com/daishihmr/vox.js
 * @author daishihmr
 * @modifier shawn0326
 */
(function() {
    /**
     * @constructor
     */
    var VOXTextureFactory = function() {

    }

    VOXTextureFactory.prototype.createCanvas = function(voxelData) {
        var canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height= 1;
        var context = canvas.getContext("2d");
        for (var i = 0, len = voxelData.palette.length; i < len; i++) {
            var p = voxelData.palette[i];
            context.fillStyle = "rgb(" + p.r + "," + p.g + "," + p.b + ")";
            context.fillRect(i * 1, 0, 1, 1);
        }

        return canvas;
    }

    /**
     * @param {vox.VoxelData} voxelData
     * @return {zen3d.Texture2D}
     */
    VOXTextureFactory.prototype.getTexture = function(voxelData) {
        var palette = voxelData.palette;
        var hashCode = getHashCode(palette);
        if (hashCode in cache) {
            // console.log("cache hit");
            return cache[hashCode];
        }

        var canvas = this.createCanvas(voxelData);
        var texture = new zen3d.Texture2D();
        texture.image = canvas;
        texture.version++;

        cache[hashCode] = texture;

        return texture;
    }

    zen3d.VOXTextureFactory = VOXTextureFactory;

    var cache = {};

    var getHashCode = function(palette) {
        var str = "";
        for (var i = 0; i < 256; i++) {
            var p = palette[i];
            str += hex(p.r);
            str += hex(p.g);
            str += hex(p.b);
            str += hex(p.a);
        }
        return zen3d.md5(str);
    };
    var hex = function(num) {
        var r = num.toString(16);
        return (r.length === 1) ? "0" + r : r;
    };

})();