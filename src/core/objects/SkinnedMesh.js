(function() {
    /**
     * SkinnedMesh
     * @class
     */
    var SkinnedMesh = function(geometry, material) {
        SkinnedMesh.superClass.constructor.call(this, geometry, material);

        this.type = zen3d.OBJECT_TYPE.SKINNED_MESH;

        this.skeleton = undefined;
    }

    zen3d.inherit(SkinnedMesh, zen3d.Mesh);

    SkinnedMesh.prototype.updateMatrix = function() {
        SkinnedMesh.superClass.updateMatrix.call(this);

        if(this.skeleton) {
            this.skeleton.updateBones();
        }
    }

    SkinnedMesh.prototype.clone = function () {
		return new this.constructor( this.geometry, this.material ).copy( this );
	}

    zen3d.SkinnedMesh = SkinnedMesh;
})();
