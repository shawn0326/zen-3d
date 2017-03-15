(function() {
    // Bone acturely is a joint
    // the position means joint position
    // mesh transform is based this joint space
    var Bone = function() {
        Bone.superClass.constructor.call(this);

        this.type = "bone";

        // the origin offset matrix
        // the inverse matrix of origin transform matrix
        this.offsetMatrix = new zen3d.Matrix4();
    }

    zen3d.inherit(Bone, zen3d.Object3D);

    zen3d.Bone = Bone;
})();