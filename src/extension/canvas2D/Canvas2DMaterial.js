(function() {
    /**
     * Canvas2DMaterial
     * @class
     */
    var Canvas2DMaterial = function() {
        Canvas2DMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.CANVAS2D;

        this.depthWrite = false;

        this.transparent = true;
    }

    zen3d.inherit(Canvas2DMaterial, zen3d.Material);

    zen3d.Canvas2DMaterial = Canvas2DMaterial;
})();
