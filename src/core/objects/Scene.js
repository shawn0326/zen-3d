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

        this.cache = new zen3d.RenderCache();
    }

    zen3d.inherit(Scene, zen3d.Object3D);

    /**
     * update scene matrix and cache it
     * @param {Camera} camera main camera for this scene
     */
    Scene.prototype.update = function(camera) {
        this.updateMatrix();

        this.cache.clear();
        this.cache.cacheScene(this, camera);
        this.cache.sort();
    }

    zen3d.Scene = Scene;
})();
