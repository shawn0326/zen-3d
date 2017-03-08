(function() {
    /**
     * base material class
     * @class
     */
    var Material = function() {

        // material type
        this.type = "";

        // material color
        this.color = new zen3d.Color3(0xffffff);

        // material map
        this.map = null;

        this.opacity = 1;

        this.transparent = false;

        this.premultipliedAlpha = false;

        // normal map
        this.normalMap = null;

        // env map
        this.envMap = null;
        this.envMapIntensity = 1;

        //blending
        this.blending = zen3d.BLEND_TYPE.NORMAL;

        // depth test
        this.depthTest = true;
        this.depthWrite = true;

        // draw side
        this.side = zen3d.DRAW_SIDE.FRONT;
    }

    zen3d.Material = Material;
})();
