(function() {
    /**
     * base material class
     * @class
     */
    var Material = function() {

        // material type
        this.type = "";

        // material color
        this.color = 0xffffff;

        // material map
        this.map = null;

        // TODO opacity
        this.opacity = 1;

        // TODO is transparent
        this.transparent = false;

    }

    /**
     * check map init
     */
    Material.prototype.checkMapInit = function() {
        return !this.map || this.map.isInit;
    }

    zen3d.Material = Material;
})();
