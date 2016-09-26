(function() {
    /**
     * base material class
     * @class
     */
    var Material = function() {

        // material type
        this.type = "";

        // material color
        // TODO this should be a diffuse color ?
        this.color = 0xffffff;

        // material map
        this.map = null;

        this.opacity = 1;

        this.transparent = false;

        // normal map
        this.normalMap = null;

    }

    /**
     * check map init
     */
    Material.prototype.checkMapInit = function() {
        return (!this.map || this.map.isRenderable) && (!this.normalMap || this.normalMap.isRenderable);
    }

    zen3d.Material = Material;
})();
