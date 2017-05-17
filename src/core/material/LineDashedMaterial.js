(function() {
    /**
     * LineDashedMaterial
     * @class
     */
    var LineDashedMaterial = function() {
        LineDashedMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.LINE_DASHED;

        this.lineWidth = 1;

        this.scale = 1;
        this.dashSize = 3;
        this.gapSize = 1;
    }

    zen3d.inherit(LineDashedMaterial, zen3d.Material);

    zen3d.LineDashedMaterial = LineDashedMaterial;
})();
