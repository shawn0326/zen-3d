
import {Object3D} from '../../objects/Object3D.js';
import {Matrix4} from '../../math/Matrix4.js';

// extends from Object3D only for use the updateMatrix method
// so all bones should be the children of skeleton
// like this:
// Skeleton
//    |-- Bone
//    |    |-- Bone
//    |    |-- Bone
//    |         |
//    |         |--Bone
//    |         |--Bone
//    |
//    |-- Bone
//    |-- Bone
function Skeleton(bones) {

    Object3D.call(this);

    this.type = "skeleton";

    // bones in array
    this.bones = bones || [];

    // bone matrices data
    this.boneMatrices = new Float32Array(16 * this.bones.length);

    // use vertex texture to update boneMatrices
    // by that way, we can use more bones on phone
    this.boneTexture = undefined;
    this.boneTextureSize = 0;

}

Skeleton.prototype = Object.assign(Object.create(Object3D.prototype), {

    constructor: Skeleton,

    updateBones: function() {

        var offsetMatrix = new Matrix4();

        return function updateBones() {

            // the world matrix of bones, is based skeleton
            this.updateMatrix();

            for(var i = 0; i < this.bones.length; i++) {
                var bone = this.bones[i];
                offsetMatrix.multiplyMatrices(bone.worldMatrix, bone.offsetMatrix);
                offsetMatrix.toArray(this.boneMatrices, i * 16);
            }

            if (this.boneTexture !== undefined) {
                this.boneTexture.version++;
            }

        }

    }()

});

export {Skeleton};