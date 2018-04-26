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

        this.clippingPlanes = []; // Planes array

        this._renderLists = {};

        this.lights = new zen3d.LightCache();
    }

    zen3d.inherit(Scene, zen3d.Object3D);

    Scene.prototype.updateRenderList = function(camera) {
        var id = camera.uuid;

        if(!this._renderLists[id]) {
            this._renderLists[id] = new zen3d.RenderList();
        }

        var renderList = this._renderLists[id];

        renderList.startCount();

        this._doUpdateRenderList(this, camera, renderList);

        renderList.endCount();

        renderList.sort();

        return renderList;
    }

    Scene.prototype.getRenderList = function(camera) {
        return this._renderLists[camera.uuid];
    }

    Scene.prototype.updateLights= function() {
        var lights = this.lights;

        this.lights.startCount();

        this._doUpdateLights(this);

        this.lights.endCount();

        return this.lights;
    }

    var OBJECT_TYPE = zen3d.OBJECT_TYPE;

    Scene.prototype._doUpdateRenderList = function(object, camera, renderList) {

        if (!!object.geometry && !!object.material) { // renderable
            renderList.add(object, camera);
        }

        // skip ui children
        if(OBJECT_TYPE.CANVAS2D === object.type) {
            return;
        }

        // handle children by recursion
        var children = object.children;
        for (var i = 0, l = children.length; i < l; i++) {
            this._doUpdateRenderList(children[i], camera, renderList);
        }
    }

    Scene.prototype._doUpdateLights = function(object) {

        if (OBJECT_TYPE.LIGHT === object.type) { // light
            this.lights.add(object);
        }

        // skip ui children
        if(OBJECT_TYPE.CANVAS2D === object.type) {
            return;
        }

        // handle children by recursion
        var children = object.children;
        for (var i = 0, l = children.length; i < l; i++) {
            this._doUpdateLights(children[i]);
        }
    }

    zen3d.Scene = Scene;
})();
