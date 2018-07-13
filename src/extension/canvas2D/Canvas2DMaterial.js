(function() {

    /**
     * Canvas2DMaterial
     * @class
     */
    var Canvas2DMaterial = function() {
        zen3d.Material.call(this);

        this.type = zen3d.MATERIAL_TYPE.CANVAS2D;

        this.depthWrite = false;

        this.transparent = true;
    }

    Canvas2DMaterial.prototype = Object.create(zen3d.Material.prototype);
    Canvas2DMaterial.prototype.constructor = Canvas2DMaterial;

    zen3d.Canvas2DMaterial = Canvas2DMaterial;
})();
