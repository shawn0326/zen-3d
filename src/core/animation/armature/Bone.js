(function() {

    // imports
    var Object3D = zen3d.Object3D;
    var Matrix4= zen3d.Matrix4;

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

    // exports
    zen3d.Bone = Bone;
    
})();