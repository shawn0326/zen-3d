(function() {
    /**
     * TextureMaterial
     * @class
     */
    var TextureMaterial = function() {
        TextureMaterial.superClass.constructor.call(this);

        this.type = zen3d.MATERIAL_TYPE.TEXTURE;

        // diffuse map
        this.diffuseMap = null;
    }

    zen3d.inherit(TextureMaterial, zen3d.Material);

    TextureMaterial.prototype.checkMapInit = function() {
        return this.diffuseMap.isInit;
    }

    zen3d.TextureMaterial = TextureMaterial;
})();
