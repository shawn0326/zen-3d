(function() {

    var sortFrontToBack = function(a, b) {
        return a.z - b.z;
    }

    var sortBackToFront = function(a, b) {
        return b.z - a.z;
    }

    var RenderList = function() {
        this.opaque = [];
        this.transparent = [];
        this.ui = [];

        this._opaqueCount = 0;
        this._transparentCount = 0;
        this._uiCount = 0;
    }

    RenderList.prototype.startCount = function () {
        this._opaqueCount = 0;
        this._transparentCount = 0;
        this._uiCount = 0;
    };

    var OBJECT_TYPE = zen3d.OBJECT_TYPE;

    var helpVector3 = new zen3d.Vector3();
    var helpSphere = new zen3d.Sphere();
    
    RenderList.prototype.add = function (object, camera) {

        // frustum test
        if(object.frustumCulled && camera.frustumCulled) {
            helpSphere.copy(object.geometry.boundingSphere).applyMatrix4(object.worldMatrix);
            var frustumTest = camera.frustum.intersectsSphere(helpSphere);
            if(!frustumTest) {
                return;
            }
        }

        // calculate z
        helpVector3.setFromMatrixPosition(object.worldMatrix);
        helpVector3.applyMatrix4(camera.viewMatrix).applyMatrix4(camera.projectionMatrix);

        if(OBJECT_TYPE.CANVAS2D === object.type) { // for ui

            var renderable = {
                object: object,
                geometry: object.geometry,
                material: object.material,
                z: helpVector3.z
            };

            this.ui[this._uiCount++] = renderable;

            return;
        }

        if(Array.isArray(object.material)){
            var groups = object.geometry.groups;

            for(var i = 0; i < groups.length; i++) {
                var group = groups[i];
                var groupMaterial = object.material[group.materialIndex];
                if(groupMaterial) {

                    var renderable = {
                        object: object,
                        geometry: object.geometry,
                        material: groupMaterial,
                        z: helpVector3.z,
                        group: group
                    };

                    if(groupMaterial.transparent) {
                        this.transparent[this._transparentCount++] = renderable;
                    } else {
                        this.opaque[this._opaqueCount++] = renderable;
                    }

                }
            }
        } else {

            var renderable = {
                object: object,
                geometry: object.geometry,
                material: object.material,
                z: helpVector3.z
            };

            if(object.material.transparent) {
                this.transparent[this._transparentCount++] = renderable;
            } else {
                this.opaque[this._opaqueCount++] = renderable;
            }

        }

    };
    
    RenderList.prototype.endCount = function () {
        this.transparent.length = this._transparentCount;
        this.opaque.length = this._opaqueCount;
        this.ui.length = this._uiCount;
    };

    RenderList.prototype.sort = function() {
        this.opaque.sort(sortFrontToBack); // need sort?
        this.transparent.sort(sortBackToFront);
        // TODO canvas2d object should render in order?
    }

    zen3d.RenderList = RenderList;
})();