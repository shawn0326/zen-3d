import {Object3D} from '../../objects/Object3D.js';
import {Matrix4} from '../../math/Matrix4.js';

// Bone acturely is a joint
// the position means joint position
// mesh transform is based this joint space
function Bone() {

    Object3D.call(this);

    this.type = "bone";

    // the origin offset matrix
    // the inverse matrix of origin transform matrix
    this.offsetMatrix = new Matrix4();

}

Bone.prototype = Object.create(Object3D.prototype);
Bone.prototype.constructor = Bone;

export {Bone};