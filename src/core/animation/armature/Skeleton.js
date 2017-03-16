(function() {
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
    var Skeleton = function(bones) {
        Skeleton.superClass.constructor.call(this);

        this.type = "skeleton";

        // bones in array
        this.bones = bones || [];

        // bone matrices data
        this.boneMatrices = new Float32Array(16 * this.bones.length);
    }

    zen3d.inherit(Skeleton, zen3d.Object3D);

    var offsetMatrix = new zen3d.Matrix4();

    Skeleton.prototype.updateBones = function() {
        // the world matrix of bones, is based skeleton
        this.updateMatrix();

        for(var i = 0; i < this.bones.length; i++) {
            var bone = this.bones[i];
            offsetMatrix.multiplyMatrices(bone.worldMatrix, bone.offsetMatrix);
            offsetMatrix.toArray(this.boneMatrices, i * 16);
        }
    }

    zen3d.Skeleton = Skeleton;
})();