import { Object3D } from '../../objects/Object3D.js';
import { Matrix4 } from '../../math/Matrix4.js';

/**
 * A bone which is part of a Skeleton.
 * The skeleton in turn is used by the SkinnedMesh.
 * Bones are almost identical to a blank Object3D.
 * Bone acturely is a joint.
 * The position means joint position.
 * Mesh transform is based this joint space.
 * @constructor
 * @memberof zen3d
 * @extends zen3d.Object3D
 */
function Bone() {

    Object3D.call(this);

    this.type = "bone";

    /**
     * The origin offset matrix - inverse matrix of the origin transform matrix.
     * @type {zen3d.Matrix4}
     */
    this.offsetMatrix = new Matrix4();

}

Bone.prototype = Object.create(Object3D.prototype);
Bone.prototype.constructor = Bone;

export { Bone };