(function() {
    /**
     * OBJECT_TYPE
     */
    var OBJECT_TYPE = {
        MESH: "mesh",
        LIGHT: "light",
        CAMERA: "camera",
        SCENE: "scene",
        GROUP: "group"
    };

    zen3d.OBJECT_TYPE = OBJECT_TYPE;

    /**
     * LIGHT_TYPE
     */
    var LIGHT_TYPE = {
        AMBIENT: "ambient",
        DIRECT: "direct",
        POINT: "point",
        SPOT: "spot"
    };

    zen3d.LIGHT_TYPE = LIGHT_TYPE;

    /**
     * MATERIAL_TYPE
     */
    var MATERIAL_TYPE = {
        BASIC: "basic",
        LAMBERT: "lambert",
        PHONG: "phong",
        CUBE: "cube"
    };

    zen3d.MATERIAL_TYPE = MATERIAL_TYPE;

    /**
     * FOG_TYPE
     */
    var FOG_TYPE = {
        NORMAL: "normal",
        EXP2: "exp2"
    };

    zen3d.FOG_TYPE = FOG_TYPE;

    /**
     * BLEND_TYPE
     */
    var BLEND_TYPE = {
        NONE: "none",
        NORMAL: "normal"
    };

    zen3d.BLEND_TYPE = BLEND_TYPE;

    /**
     * CULL_FACE_TYPE
     */
    var CULL_FACE_TYPE = {
        NONE: "none",
        FRONT: "front",
        BACK: "back",
        FRONT_AND_BACK: "front_and_back"
    };

    zen3d.CULL_FACE_TYPE = CULL_FACE_TYPE;

})();
