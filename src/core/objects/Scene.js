import {OBJECT_TYPE} from '../const.js';
import {LightCache} from '../render/LightCache.js';
import {RenderList} from '../render/RenderList.js';
import {Object3D} from './Object3D.js';

/**
 * Scene
 * @class
 */
function Scene() {
    Object3D.call(this);

    this.type = OBJECT_TYPE.SCENE;

    this.overrideMaterial = null;

    this.fog = null;

    this.clippingPlanes = []; // Planes array

    this._renderLists = {};

    this.lights = new LightCache();
}

Scene.prototype = Object.assign(Object.create(Object3D.prototype), {

    constructor: Scene,

    updateRenderList: function(camera) {
        var id = camera.uuid;

        if(!this._renderLists[id]) {
            this._renderLists[id] = new RenderList();
        }

        var renderList = this._renderLists[id];

        renderList.startCount();

        this._doUpdateRenderList(this, camera, renderList);

        renderList.endCount();

        renderList.sort();

        return renderList;
    },

    getRenderList: function(camera) {
        return this._renderLists[camera.uuid];
    },

    updateLights: function() {
        var lights = this.lights;

        this.lights.startCount();

        this._doUpdateLights(this);

        this.lights.endCount();

        return this.lights;
    },

    _doUpdateRenderList: function(object, camera, renderList) {

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
    },

    _doUpdateLights: function(object) {

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

});

export {Scene};
