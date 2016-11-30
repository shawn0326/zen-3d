(function() {
    /**
     * SpriteMaterial
     * @class
     */
    var SpriteMaterial = function() {
        SpriteMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.SPRITE;

        this.rotation = 0;

    	this.fog = false;
    }

    zen3d.inherit(SpriteMaterial, zen3d.Material);

    zen3d.SpriteMaterial = SpriteMaterial;
})();
