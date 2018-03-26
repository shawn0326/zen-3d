(function() {
    /**
     * Scene
     * @class
     */
    var Scene = function() {
        Scene.superClass.constructor.call(this);

        this.type = zen3d.OBJECT_TYPE.SCENE;

        this.overrideMaterial = null;

        this.fog = null;
    }

    zen3d.inherit(Scene, zen3d.Object3D);

    zen3d.Scene = Scene;
})();
