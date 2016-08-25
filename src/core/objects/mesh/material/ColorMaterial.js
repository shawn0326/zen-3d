(function() {
    /**
     * ColorMaterial
     * @class
     */
    var ColorMaterial = function() {
        ColorMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.COLOR;

        this.color = 0xffffff;
    }

    zen3d.inherit(ColorMaterial, zen3d.Material);

    zen3d.ColorMaterial = ColorMaterial;
})();
