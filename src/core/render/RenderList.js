import {Vector3} from '../math/Vector3.js';
import {Sphere} from '../math/Sphere.js';

var helpVector3 = new Vector3();
var helpSphere = new Sphere();

var sortFrontToBack = function(a, b) {
    if (a.renderOrder !== b.renderOrder) {
        return a.renderOrder - b.renderOrder;
    } else {
        return a.z - b.z;
    }
}

var sortBackToFront = function(a, b) {
    if (a.renderOrder !== b.renderOrder) {
        return a.renderOrder - b.renderOrder;
    } else {
        return b.z - a.z;
    }
}

function RenderList() {

    var renderItems = [];
	var renderItemsIndex = 0;

    var opaque = [];
    var opaqueCount = 0;
    var transparent = [];
    var transparentCount = 0;

    function startCount() {
        renderItemsIndex = 0;

        opaqueCount = 0;
        transparentCount = 0;
    }

    function add(object, camera) {

        // frustum test
        if(object.frustumCulled && camera.frustumCulled) {
            helpSphere.copy(object.geometry.boundingSphere).applyMatrix4(object.worldMatrix);
            var frustumTest = camera.frustum.intersectsSphere(helpSphere);
            if(!frustumTest) { // only test bounding sphere
                return;
            }
        }

        // calculate z
        helpVector3.setFromMatrixPosition(object.worldMatrix);
        helpVector3.applyMatrix4(camera.viewMatrix).applyMatrix4(camera.projectionMatrix);

        if(Array.isArray(object.material)){
            var groups = object.geometry.groups;

            for(var i = 0; i < groups.length; i++) {
                var group = groups[i];
                var groupMaterial = object.material[group.materialIndex];
                if(groupMaterial) {
                    _doAdd(object, object.geometry, groupMaterial, helpVector3.z, group);
                }
            }
        } else {
            _doAdd(object, object.geometry, object.material, helpVector3.z);
        }

    }

    function _doAdd(object, geometry, material, z, group) {

        var renderable = renderItems[renderItemsIndex];

        if (renderable === undefined) {
            renderable = {
                object: object,
                geometry: geometry,
                material: material,
                z: z,
                renderOrder: object.renderOrder,
                group: group
            };
            renderItems[ renderItemsIndex ] = renderable;
        } else {
            renderable.object = object;
            renderable.geometry = geometry;
            renderable.material = material;
            renderable.z = z;
            renderable.renderOrder = object.renderOrder;
            renderable.group = group;
        }
        
        if (material.transparent) {
            transparent[transparentCount] = renderable;
            transparentCount++;
        } else {
            opaque[opaqueCount] = renderable;
            opaqueCount++;
        }

        renderItemsIndex ++;

    }

    function endCount() {
        opaque.length = opaqueCount;
        transparent.length = transparentCount;
    }

    function sort() {
        opaque.sort(sortFrontToBack);
        transparent.sort(sortBackToFront);
    }

    return {
        opaque: opaque,
        transparent: transparent,
        startCount: startCount,
        add: add,
        endCount: endCount,
        sort: sort
    };

}

export {RenderList};