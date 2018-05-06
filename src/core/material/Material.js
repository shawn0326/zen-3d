(function() {
    var BLEND_EQUATION = zen3d.BLEND_EQUATION;
    var BLEND_FACTOR = zen3d.BLEND_FACTOR;

    /**
     * base material class
     * @class
     */
    var Material = function() {

        // material type
        this.type = "";

        this.opacity = 1;

        this.transparent = false;

        //blending
        this.blending = zen3d.BLEND_TYPE.NORMAL;

        this.blendSrc = BLEND_FACTOR.SRC_ALPHA;
        this.blendDst = BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
        this.blendEquation = BLEND_EQUATION.ADD;
        this.blendSrcAlpha = null;
        this.blendDstAlpha = null;
        this.blendEquationAlpha = null;

        this.premultipliedAlpha = false;

        // use vertex colors
        this.vertexColors = false;

        // diffuse
        this.diffuse = new zen3d.Color3(0xffffff);
        this.diffuseMap = null;

        // normal
        this.normalMap = null;

        // aoMap
        this.aoMap = null;
	    this.aoMapIntensity = 1.0;

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

        // draw mode
        this.drawMode = zen3d.DRAW_MODE.TRIANGLES;
    }

    Material.prototype.clone = function () {
		return new this.constructor().copy( this );
	}

    Material.prototype.copy = function(source) {
        this.type = source.type;
        this.opacity = source.opacity;
        this.transparent = source.transparent;
        this.premultipliedAlpha = source.premultipliedAlpha;
        this.vertexColors = source.vertexColors;
        this.diffuse.copy(source.diffuse);
        this.diffuseMap = source.diffuseMap;
        this.normalMap = source.normalMap;
        this.bumpMap = source.bumpMap;
	    this.bumpScale = source.bumpScale;
        this.envMap = source.envMap;
        this.envMapIntensity = source.envMapIntensity;
        this.envMapCombine = source.envMapCombine;
        this.emissive.copy(source.emissive);
        this.emissiveMap = source.emissiveMap;
        this.emissiveIntensity = source.emissiveIntensity;
        this.blending = source.blending;
        this.depthTest = source.depthTest;
        this.depthWrite = source.depthWrite;
        this.side = source.side;
        this.shading = source.shading;
        this.acceptLight = source.acceptLight;
        this.drawMode = source.drawMode;

        return this;
    }

    zen3d.Material = Material;
})();
