(function() {
    /**
     * base material class
     * @class
     */
    var Material = function() {

        // material type
        this.type = "";

        this.opacity = 1;

        this.transparent = false;

        this.premultipliedAlpha = false;

        // diffuse
        this.diffuse = new zen3d.Color3(0xffffff);
        this.diffuseMap = null;

        // normal
        this.normalMap = null;

        // bump
        this.bumpMap = null;
	    this.bumpScale = 1;

        // env
        this.envMap = null;
        this.envMapIntensity = 1;
        this.envMapCombine = zen3d.ENVMAP_COMBINE_TYPE.MULTIPLY;

        // emissive
        this.emissive = new zen3d.Color3(0x000000);
        this.emissiveMap = null;
        this.emissiveIntensity = 1;

        //blending
        this.blending = zen3d.BLEND_TYPE.NORMAL;

        // depth test
        this.depthTest = true;
        this.depthWrite = true;

        // draw side
        this.side = zen3d.DRAW_SIDE.FRONT;

        // shading type: SMOOTH_SHADING, FLAT_SHADING
        this.shading = zen3d.SHADING_TYPE.SMOOTH_SHADING;

        // use light
        // if use light, renderer will try to upload light uniforms
        this.acceptLight = false;
    }

    zen3d.Material = Material;
})();
