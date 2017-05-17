(function() {
    /**
     * LineBasicMaterial
     * @class
     */
    var LineBasicMaterial = function() {
        LineBasicMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.LINE_BASIC;

        this.lineWidth = 1;
    }

    zen3d.inherit(LineBasicMaterial, zen3d.Material);

    zen3d.LineBasicMaterial = LineBasicMaterial;
})();
