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

        // env map
        this.envMap = null;
        this.envMapIntensity = 1;

    }

    /**
     * check map init
     */
    Material.prototype.checkMapInit = function() {
        return (!this.map || this.map.isRenderable) &&
            (!this.normalMap || this.normalMap.isRenderable) &&
            (!this.envMap || this.envMap.isRenderable) &&
            (!this.cubeMap || this.cubeMap.isRenderable);
    }

    zen3d.Material = Material;
})();
