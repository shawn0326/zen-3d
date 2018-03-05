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

    SpriteMaterial.prototype.copy = function(source) {
        SpriteMaterial.superClass.copy.call(this, source);

        this.rotation = source.rotation;
        this.fog = source.fog;

        return this;
    }

    zen3d.SpriteMaterial = SpriteMaterial;
})();
