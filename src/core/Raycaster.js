import {Ray} from './math/Ray.js';

/**
 * This creates a new raycaster object.
 * @memberof zen3d
 * @constructor
 * @param {zen3d.Vector3} origin — The origin vector where the ray casts from.
 * @param {zen3d.Vector3} direction — The direction vector that gives direction to the ray. Should be normalized.
 * @param {number} [near=0] — All results returned are further away than near. Near can't be negative.
 * @param {number} [far=Infinity] All results returned are closer than far. Far can't be lower than near.
 */
function Raycaster(origin, direction, near, far) {

    /**
     * The Ray used for the raycasting.
     * @member {zen3d.Ray}
     */
    this.ray = new Ray(origin, direction);

    /**
     * The near factor of the raycaster. This value indicates which objects can be discarded based on the distance. This value shouldn't be negative and should be smaller than the far property.
     * @member {number}
     */
    this.near = near || 0;

    /**
     * The far factor of the raycaster. This value indicates which objects can be discarded based on the distance. This value shouldn't be negative and should be larger than the near property.
     * @member {number}
     */
    this.far = far || Infinity;

}

function ascSort(a, b) {
    return a.distance - b.distance;
}

function intersectObject(object, raycaster, intersects, recursive) {
    object.raycast(raycaster, intersects);

    if (recursive === true) {
        var children = object.children;

        for (var i = 0, l = children.length; i < l; i++) {
            intersectObject(children[i], raycaster, intersects, true);
        }
    }
}


Object.assign(Raycaster.prototype, /** @lends zen3d.Raycaster.prototype */{

    /**
     * Updates the ray with a new origin and direction.
     * @param {zen3d.Vector3} origin — The origin vector where the ray casts from.
     * @param {zen3d.Vector3} direction — The normalized direction vector that gives direction to the ray.
     */
    set: function(origin, direction) {
        this.ray.set(origin, direction);
    },

    /**
     * Updates the ray with a new origin and direction.
     * @param {zen3d.Vector2} coords — 2D coordinates of the mouse, in normalized device coordinates (NDC)---X and Y components should be between -1 and 1.
     * @param {zen3d.Camera} camera — camera from which the ray should originate.
     */
    setFromCamera: function(coords, camera) {
        // if ((camera && camera.isPerspectiveCamera)) {
            this.ray.origin.setFromMatrixPosition(camera.worldMatrix);
            this.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(this.ray.origin).normalize();
        // } else if ((camera && camera.isOrthographicCamera)) { // TODO
        //     this.ray.origin.set(coords.x, coords.y, (camera.near + camera.far) / (camera.near - camera.far)).unproject(camera); // set origin in plane of camera
        //     this.ray.direction.set(0, 0, -1).transformDirection(camera.worldMatrix);
        // } else {
        //     console.error('Raycaster: Unsupported camera type.');
        // }
    },

    /**
     * Checks all intersection between the ray and the object with or without the descendants. Intersections are returned sorted by distance, closest first. An array of intersections is returned:
     * [ { distance, point, face, faceIndex, object }, ... ]
     * @param {zen3d.Object3D} object — The object to check for intersection with the ray.
     * @param {boolean} [recursive=] — If true, it also checks all descendants. Otherwise it only checks intersecton with the object.
     * @return {Object[]} An array of intersections
     */
    intersectObject: function(object, recursive) {
        var intersects = [];

        intersectObject(object, this, intersects, recursive);

        intersects.sort(ascSort);

        return intersects;
    },

    /**
     * Checks all intersection between the ray and the objects with or without the descendants. Intersections are returned sorted by distance, closest first. An array of intersections is returned:
     * [ { distance, point, face, faceIndex, object }, ... ]
     * @param {zen3d.Object3D[]} objects — The objects to check for intersection with the ray.
     * @param {boolean} [recursive=] — If true, it also checks all descendants. Otherwise it only checks intersecton with the object.
     * @return {Object[]} An array of intersections
     */
    intersectObjects: function(objects, recursive) {
        var intersects = [];

        if (Array.isArray(objects) === false) {
            console.warn('Raycaster.intersectObjects: objects is not an Array.');
            return intersects;
        }

        for (var i = 0, l = objects.length; i < l; i++) {
            intersectObject(objects[i], this, intersects, recursive);
        }

        intersects.sort(ascSort);

        return intersects;
    }

});

export {Raycaster};